'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransferForm } from '@/components/transactions/TransferForm';
import {
  useTransactions,
  useDeleteTransaction,
  Transaction,
  TransactionFilters,
} from '@/lib/hooks/useTransactions';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { useCategories } from '@/lib/hooks/useCategories';
import { useDebounce } from '@/lib/hooks/useDebounce';

export default function TransactionsPage() {
  // Separate state for immediate UI updates
  const [searchInput, setSearchInput] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Debounce the search input to avoid API calls on every keystroke
  const debouncedSearch = useDebounce(searchInput, 500);

  // Memoize filters to prevent unnecessary rerenders
  const filters = useMemo<TransactionFilters>(
    () => ({
      search: debouncedSearch || undefined,
      account_id: accountFilter || undefined,
      category_id: categoryFilter || undefined,
      type: typeFilter || undefined,
    }),
    [debouncedSearch, accountFilter, categoryFilter, typeFilter]
  );

  const { data: transactionsData, isLoading, isFetching, error } = useTransactions(filters);
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const deleteTransaction = useDeleteTransaction();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleDelete = async (transaction: Transaction) => {
    if (confirm(`Are you sure you want to delete this transaction?`)) {
      try {
        await deleteTransaction.mutateAsync(transaction.id);
      } catch (error: any) {
        alert(error.message || 'Failed to delete transaction');
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingTransaction(null);
  };

  // Only show full-page loading on initial load (no data yet)
  if (isLoading && !transactionsData) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-600 dark:text-red-400 py-8">
          Error loading transactions: {error.message}
        </div>
      </MainLayout>
    );
  }

  const transactions = transactionsData?.data || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Transactions
              {isFetching && transactionsData && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  Loading...
                </span>
              )}
            </h1>
            <p className="mt-2 text-muted-foreground">Manage your income and expenses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowTransferModal(true)}>
              Transfer
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>Add Transaction</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-4 rounded-lg border shadow-sm">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Search</label>
            <Input
              type="text"
              placeholder="Search payee..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Account</label>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-full border-input bg-background rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Accounts</option>
              {accounts?.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border-input bg-background rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border-input bg-background rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-muted/50 rounded-lg border-2 border-dashed border-muted p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No transactions yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first transaction
            </p>
            <Button onClick={() => setShowCreateModal(true)}>Create your first transaction</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Edit Transaction' : 'Create New Transaction'}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={editingTransaction || undefined}
            onSuccess={handleCloseModal}
            onCancel={handleCloseModal}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transfer Between Accounts</DialogTitle>
          </DialogHeader>
          <TransferForm
            onSuccess={() => setShowTransferModal(false)}
            onCancel={() => setShowTransferModal(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
