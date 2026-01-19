<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $accounts = $request->user()
            ->accounts()
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success(AccountResource::collection($accounts));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateAccountRequest $request): JsonResponse
    {
        $user = $request->user();

        // Free tier account limit check (T054)
        if ($user->subscription_tier === 'free' && $user->accounts()->count() >= 2) {
            return $this->error('Free tier users can only create up to 2 accounts. Please upgrade to create more.', 403);
        }

        $account = $user->accounts()->create([
            'name' => $request->name,
            'type' => $request->type,
            'balance' => 0, // Start at 0, opening balance will be set via transaction
            'currency' => $request->currency,
            'is_asset' => $request->is_asset,
        ]);

        // Create opening balance transaction if initial balance is provided
        $initialBalance = $request->balance ?? 0;
        if ($initialBalance != 0) {
            // Get or create "Opening Balance" category
            $category = \App\Models\Category::firstOrCreate(
                ['name' => 'Opening Balance', 'is_system' => true],
                [
                    'user_id' => null,
                    'parent_id' => null,
                    'icon' => 'flag',
                    'is_protected' => false,
                    'display_order' => 999,
                ]
            );

            // Create transaction for opening balance
            $transactionType = $initialBalance > 0 ? 'income' : 'expense';
            \App\Models\Transaction::create([
                'account_id' => $account->id,
                'category_id' => $category->id,
                'type' => $transactionType,
                'amount' => abs($initialBalance),
                'date' => now()->toDateString(),
                'payee' => 'Opening Balance',
                'notes' => 'Initial account balance',
                'is_duplicate_flagged' => false,
            ]);

            // Recalculate balance to reflect the opening balance transaction
            $account->refresh();
            $account->update(['balance' => $initialBalance]);
        }

        return $this->created(new AccountResource($account), 'Account created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Account $account): JsonResponse
    {
        $this->authorize('view', $account);

        return $this->success(new AccountResource($account));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccountRequest $request, Account $account): JsonResponse
    {
        $this->authorize('update', $account);

        $account->update($request->validated());

        return $this->success(new AccountResource($account), 'Account updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Account $account): JsonResponse
    {
        $this->authorize('delete', $account);

        $account->delete();

        return $this->success(null, 'Account deleted successfully');
    }
}
