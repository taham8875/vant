'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { useCreateTransfer, CreateTransferData } from '@/lib/hooks/useTransactions';
import { useAccounts } from '@/lib/hooks/useAccounts';

interface TransferFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransferForm({ onSuccess, onCancel }: TransferFormProps) {
  const createTransfer = useCreateTransfer();
  const { data: accounts } = useAccounts();

  const [formData, setFormData] = useState<CreateTransferData>({
    from_account_id: '',
    to_account_id: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await createTransfer.mutateAsync(formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: [error.message || 'Failed to create transfer'] });
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

      <FormField
        label="From Account"
        htmlFor="from_account_id"
        required
        error={errors.from_account_id}
      >
        <select
          id="from_account_id"
          name="from_account_id"
          required
          value={formData.from_account_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select source account</option>
          {accounts?.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} - {account.currency} {account.balance}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="To Account" htmlFor="to_account_id" required error={errors.to_account_id}>
        <select
          id="to_account_id"
          name="to_account_id"
          required
          value={formData.to_account_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select destination account</option>
          {accounts?.map((account) => (
            <option
              key={account.id}
              value={account.id}
              disabled={account.id === formData.from_account_id}
            >
              {account.name} - {account.currency} {account.balance}
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

      <FormField label="Notes" htmlFor="notes" error={errors.notes}>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add notes about this transfer..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </FormField>

      <div className="flex gap-3">
        <Button type="submit" loading={createTransfer.isPending} className="flex-1">
          Create Transfer
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
