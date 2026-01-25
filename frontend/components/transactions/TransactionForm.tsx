'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import {
  useCreateTransaction,
  useUpdateTransaction,
  CreateTransactionData,
  Transaction,
} from '@/lib/hooks/useTransactions';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { useCategories } from '@/lib/hooks/useCategories';

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  const [formData, setFormData] = useState<CreateTransactionData>({
    account_id: transaction?.account_id || '',
    category_id: transaction?.category_id || '',
    type: transaction?.type || 'expense',
    amount: transaction ? parseFloat(transaction.amount) : 0,
    date: transaction?.date || new Date().toISOString().split('T')[0],
    payee: transaction?.payee || '',
    notes: transaction?.notes || '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (transaction) {
        await updateTransaction.mutateAsync({ id: transaction.id, data: formData });
      } else {
        await createTransaction.mutateAsync(formData);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: [error.message || 'Failed to save transaction'] });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormError errors={errors.general} />

      <FormField label="Account" htmlFor="account_id" required error={errors.account_id}>
        <select
          id="account_id"
          name="account_id"
          required
          value={formData.account_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select an account</option>
          {accounts?.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Type" htmlFor="type" required error={errors.type}>
        <select
          id="type"
          name="type"
          required
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
        </select>
      </FormField>

      <FormField label="Category" htmlFor="category_id" required error={errors.category_id}>
        <select
          id="category_id"
          name="category_id"
          required
          value={formData.category_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.parent_id ? `  ${category.name}` : category.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Amount" htmlFor="amount" required error={errors.amount}>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          required
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
        />
      </FormField>

      <FormField label="Date" htmlFor="date" required error={errors.date}>
        <Input
          id="date"
          name="date"
          type="date"
          required
          value={formData.date}
          onChange={handleChange}
        />
      </FormField>

      <FormField label="Payee" htmlFor="payee" error={errors.payee}>
        <Input
          id="payee"
          name="payee"
          type="text"
          value={formData.payee}
          onChange={handleChange}
          placeholder="Merchant or person"
        />
      </FormField>

      <FormField label="Notes" htmlFor="notes" error={errors.notes}>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add notes..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </FormField>

      <div className="flex gap-3">
        <Button
          type="submit"
          loading={createTransaction.isPending || updateTransaction.isPending}
          className="flex-1"
        >
          {transaction ? 'Update Transaction' : 'Create Transaction'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
