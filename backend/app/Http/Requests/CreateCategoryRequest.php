<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'parent_id' => [
                'nullable',
                'uuid',
                'exists:categories,id',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $parent = Category::find($value);

                        // Ensure parent is accessible (system or user's own)
                        if ($parent && ! $parent->is_system && $parent->user_id !== $this->user()->id) {
                            $fail('The selected parent category is invalid.');
                        }

                        // Prevent creating subcategories more than 2 levels deep
                        if ($parent && $parent->parent_id !== null) {
                            $fail('Cannot create subcategories more than 2 levels deep.');
                        }
                    }
                },
            ],
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories')->where(function ($query) {
                    return $query->where('user_id', $this->user()->id);
                }),
            ],
            'icon' => ['nullable', 'string', 'max:50'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'parent_id.uuid' => 'Invalid parent category ID format',
            'parent_id.exists' => 'The selected parent category does not exist',
            'name.required' => 'Category name is required',
            'name.max' => 'Category name cannot exceed 100 characters',
            'name.unique' => 'You already have a category with this name',
            'icon.max' => 'Icon identifier cannot exceed 50 characters',
            'display_order.integer' => 'Display order must be a number',
            'display_order.min' => 'Display order cannot be negative',
        ];
    }
}
