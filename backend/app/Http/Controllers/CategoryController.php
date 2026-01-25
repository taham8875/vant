<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Get system categories and user's custom categories
        $categories = Category::query()
            ->where(function ($query) use ($user) {
                $query->where('is_system', true)
                    ->orWhere('user_id', $user->id);
            })
            ->with(['parent', 'children'])
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return $this->success(CategoryResource::collection($categories));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateCategoryRequest $request): JsonResponse
    {
        $user = $request->user();

        $category = Category::create([
            'user_id' => $user->id,
            'parent_id' => $request->parent_id,
            'name' => $request->name,
            'icon' => $request->icon,
            'is_system' => false,
            'is_protected' => false,
            'display_order' => $request->display_order ?? $this->getNextDisplayOrder($user->id),
        ]);

        return $this->created(
            new CategoryResource($category->load(['parent', 'children'])),
            'Category created successfully'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Category $category): JsonResponse
    {
        $this->authorize('view', $category);

        return $this->success(new CategoryResource($category->load(['parent', 'children'])));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $this->authorize('update', $category);

        $category->update($request->validated());

        return $this->success(
            new CategoryResource($category->load(['parent', 'children'])),
            'Category updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Category $category): JsonResponse
    {
        $this->authorize('delete', $category);

        // Get the "Uncategorized" system category
        $uncategorized = Category::where('name', 'Uncategorized')
            ->where('is_system', true)
            ->first();

        if (! $uncategorized) {
            return $this->error('Uncategorized category not found. Cannot delete category.', 500);
        }

        // Move transactions from this category to Uncategorized
        Transaction::where('category_id', $category->id)->update([
            'category_id' => $uncategorized->id,
        ]);

        // Move transactions from child categories to Uncategorized (before cascade delete)
        $childIds = $category->children->pluck('id');
        if ($childIds->isNotEmpty()) {
            Transaction::whereIn('category_id', $childIds)->update([
                'category_id' => $uncategorized->id,
            ]);
        }

        // Delete the category (cascade will delete children)
        $category->delete();

        return $this->success(null, 'Category deleted successfully');
    }

    /**
     * Get the next display order for a user's categories.
     */
    private function getNextDisplayOrder(string $userId): int
    {
        $maxOrder = Category::where('user_id', $userId)->max('display_order');

        return ($maxOrder ?? 0) + 1;
    }
}
