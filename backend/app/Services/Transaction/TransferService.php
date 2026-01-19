<?php

namespace App\Services\Transaction;

use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class TransferService
{
    public function __construct(
        protected TransactionService $transactionService
    ) {}

    /**
     * Create a transfer between two accounts (two linked transactions).
     */
    public function createTransfer(array $data): array
    {
        return DB::transaction(function () use ($data) {
            // Create expense transaction from source account
            $expenseTransaction = Transaction::create([
                'account_id' => $data['from_account_id'],
                'category_id' => $this->getTransferCategoryId(),
                'type' => 'expense',
                'amount' => $data['amount'],
                'date' => $data['date'],
                'payee' => 'Transfer',
                'notes' => $data['notes'] ?? null,
                'is_duplicate_flagged' => false,
            ]);

            // Create income transaction to destination account
            $incomeTransaction = Transaction::create([
                'account_id' => $data['to_account_id'],
                'category_id' => $this->getTransferCategoryId(),
                'type' => 'income',
                'amount' => $data['amount'],
                'date' => $data['date'],
                'payee' => 'Transfer',
                'notes' => $data['notes'] ?? null,
                'is_duplicate_flagged' => false,
            ]);

            // Link the transactions bidirectionally
            $expenseTransaction->update(['linked_transaction_id' => $incomeTransaction->id]);
            $incomeTransaction->update(['linked_transaction_id' => $expenseTransaction->id]);

            // Recalculate balances for both accounts
            $this->transactionService->recalculateAccountBalance($data['from_account_id']);
            $this->transactionService->recalculateAccountBalance($data['to_account_id']);

            return [
                'expense' => $expenseTransaction->load(['account', 'category']),
                'income' => $incomeTransaction->load(['account', 'category']),
            ];
        });
    }

    /**
     * Get or create the "Transfers" category ID.
     */
    protected function getTransferCategoryId(): ?string
    {
        $category = \App\Models\Category::where('name', 'Transfers')
            ->where('is_system', true)
            ->first();

        return $category?->id;
    }
}
