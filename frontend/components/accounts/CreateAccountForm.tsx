'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { useCreateAccount, CreateAccountData } from '@/lib/hooks/useAccounts';

interface CreateAccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateAccountForm({ onSuccess, onCancel }: CreateAccountFormProps) {
  const createAccount = useCreateAccount();
  const [formData, setFormData] = useState<CreateAccountData>({
    name: '',
    type: 'checking',
    balance: 0,
    currency: 'USD',
    is_asset: true,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await createAccount.mutateAsync(formData);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: [error.message || 'Failed to create account'] });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'balance') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormError errors={errors.general} />

      <FormField label="Account Name" htmlFor="name" required error={errors.name}>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Main Checking"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </FormField>

      <FormField label="Account Type" htmlFor="type" required error={errors.type}>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit_card">Credit Card</option>
          <option value="cash">Cash</option>
          <option value="investment">Investment</option>
        </select>
      </FormField>

      <FormField label="Current Balance" htmlFor="balance" required error={errors.balance}>
        <Input
          type="number"
          step="0.01"
          id="balance"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          placeholder="0.00"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </FormField>

      <FormField label="Currency" htmlFor="currency" required error={errors.currency}>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </select>
      </FormField>

      <FormField label="Account Classification" htmlFor="is_asset" error={errors.is_asset}>
        <div className="flex items-center gap-2">
          <input
            id="is_asset"
            name="is_asset"
            type="checkbox"
            checked={formData.is_asset}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="is_asset" className="text-sm text-foreground">
            This is an asset account (unchecked means liability)
          </label>
        </div>
      </FormField>

      <div className="flex gap-3">
        <Button type="submit" loading={createAccount.isPending} className="flex-1">
          Create Account
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
