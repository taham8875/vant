<?php

namespace App\Services\Transaction;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    /**
     * Create a new transaction and update account balance.
     */
    public function createTransaction(array $data): Transaction
    {
        return DB::transaction(function () use ($data) {
            $transaction = Transaction::create($data);

            $this->recalculateAccountBalance($transaction->account_id);

            return $transaction->load(['account', 'category']);
        });
    }

    /**
     * Update an existing transaction and recalculate balances.
     */
    public function updateTransaction(Transaction $transaction, array $data): Transaction
    {
        return DB::transaction(function () use ($transaction, $data) {
            $oldAccountId = $transaction->account_id;

            $transaction->update($data);

            // Recalculate balance for old account if account changed
            if (isset($data['account_id']) && $data['account_id'] !== $oldAccountId) {
                $this->recalculateAccountBalance($oldAccountId);
            }

            // Recalculate balance for current account
            $this->recalculateAccountBalance($transaction->account_id);

            return $transaction->fresh(['account', 'category']);
        });
    }

    /**
     * Delete a transaction and update account balance.
     */
    public function deleteTransaction(Transaction $transaction): bool
    {
        return DB::transaction(function () use ($transaction) {
            $accountId = $transaction->account_id;
            $linkedTransactionId = $transaction->linked_transaction_id;

            // Delete the transaction
            $transaction->delete();

            // Delete linked transaction if this is a transfer
            if ($linkedTransactionId) {
                Transaction::where('id', $linkedTransactionId)->delete();
            }

            // Recalculate account balance
            $this->recalculateAccountBalance($accountId);

            // If there was a linked transaction, recalculate that account too
            if ($linkedTransactionId) {
                $linkedTransaction = Transaction::withTrashed()->find($linkedTransactionId);
                if ($linkedTransaction) {
                    $this->recalculateAccountBalance($linkedTransaction->account_id);
                }
            }

            return true;
        });
    }

    /**
     * Recalculate account balance based on all transactions.
     */
    public function recalculateAccountBalance(string $accountId): void
    {
        $account = Account::findOrFail($accountId);

        // Calculate total income
        $totalIncome = Transaction::where('account_id', $accountId)
            ->where('type', 'income')
            ->sum('amount');

        // Calculate total expenses
        $totalExpense = Transaction::where('account_id', $accountId)
            ->where('type', 'expense')
            ->sum('amount');

        // Update account balance
        $balance = $totalIncome - $totalExpense;
        $account->update(['balance' => $balance]);
    }

    /**
     * Bulk categorize transactions.
     */
    public function bulkCategorize(array $transactionIds, string $categoryId): int
    {
        return Transaction::whereIn('id', $transactionIds)
            ->update(['category_id' => $categoryId]);
    }
}
