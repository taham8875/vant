<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateTransactionRequest;
use App\Http\Requests\CreateTransferRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Account;
use App\Models\Transaction;
use App\Services\Transaction\TransactionService;
use App\Services\Transaction\TransferService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(
        protected TransactionService $transactionService,
        protected TransferService $transferService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Transaction::query()
            ->whereHas('account', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->with(['account', 'category'])
            ->freeTierHistory($user);

        // Filter by account
        if ($request->has('account_id')) {
            $query->where('account_id', $request->account_id);
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        // Search by payee
        if ($request->has('search')) {
            $query->where('payee', 'ILIKE', '%'.$request->search.'%');
        }

        $transactions = $query->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 50));

        return $this->success([
            'data' => TransactionResource::collection($transactions->items()),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
                'last_page' => $transactions->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateTransactionRequest $request): JsonResponse
    {
        $user = $request->user();

        // Verify account belongs to user
        $account = Account::findOrFail($request->account_id);
        if ($account->user_id !== $user->id) {
            return $this->error('Unauthorized', 403);
        }

        $transaction = $this->transactionService->createTransaction($request->validated());

        return $this->created(
            new TransactionResource($transaction),
            'Transaction created successfully'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Transaction $transaction): JsonResponse
    {
        // Verify transaction belongs to user's account
        if ($transaction->account->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        return $this->success(new TransactionResource($transaction->load(['account', 'category'])));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction): JsonResponse
    {
        // Verify transaction belongs to user's account
        if ($transaction->account->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        $transaction = $this->transactionService->updateTransaction($transaction, $request->validated());

        return $this->success(
            new TransactionResource($transaction),
            'Transaction updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Transaction $transaction): JsonResponse
    {
        // Verify transaction belongs to user's account
        if ($transaction->account->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        $this->transactionService->deleteTransaction($transaction);

        return $this->success(null, 'Transaction deleted successfully');
    }

    /**
     * Create a transfer between two accounts.
     */
    public function transfer(CreateTransferRequest $request): JsonResponse
    {
        $user = $request->user();

        // Verify both accounts belong to user
        $fromAccount = Account::findOrFail($request->from_account_id);
        $toAccount = Account::findOrFail($request->to_account_id);

        if ($fromAccount->user_id !== $user->id || $toAccount->user_id !== $user->id) {
            return $this->error('Unauthorized', 403);
        }

        $transactions = $this->transferService->createTransfer($request->validated());

        return $this->created([
            'expense' => new TransactionResource($transactions['expense']),
            'income' => new TransactionResource($transactions['income']),
        ], 'Transfer created successfully');
    }

    /**
     * Bulk categorize transactions.
     */
    public function bulkCategorize(Request $request): JsonResponse
    {
        $request->validate([
            'transaction_ids' => ['required', 'array', 'min:1'],
            'transaction_ids.*' => ['required', 'uuid', 'exists:transactions,id'],
            'category_id' => ['required', 'uuid', 'exists:categories,id'],
        ]);

        $user = $request->user();

        // Verify all transactions belong to user
        $count = Transaction::whereIn('id', $request->transaction_ids)
            ->whereHas('account', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->count();

        if ($count !== count($request->transaction_ids)) {
            return $this->error('Unauthorized', 403);
        }

        $updated = $this->transactionService->bulkCategorize(
            $request->transaction_ids,
            $request->category_id
        );

        return $this->success([
            'updated_count' => $updated,
        ], "Successfully categorized {$updated} transactions");
    }
}
