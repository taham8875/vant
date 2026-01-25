'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AccountCard } from '@/components/accounts/AccountCard';
import { CreateAccountForm } from '@/components/accounts/CreateAccountForm';
import { useAccounts, useDeleteAccount, Account } from '@/lib/hooks/useAccounts';

export default function AccountsPage() {
  const { data: accounts, isLoading, error } = useAccounts();
  const deleteAccount = useDeleteAccount();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDelete = async (account: Account) => {
    if (confirm(`Are you sure you want to delete "${account.name}"?`)) {
      try {
        await deleteAccount.mutateAsync(account.id);
      } catch (error: any) {
        alert(error.message || 'Failed to delete account');
      }
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading accounts...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-600 dark:text-red-400 py-8">
          Error loading accounts. Please try again.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Accounts</h1>
            <p className="mt-2 text-muted-foreground">Manage your bank accounts and credit cards</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>Add Account</Button>
        </div>

        {accounts?.length === 0 ? (
          <div className="bg-muted/50 rounded-lg border-2 border-dashed border-muted p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No accounts yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first account to start tracking your finances
            </p>
            <Button onClick={() => setShowCreateModal(true)}>Add Account</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts?.map((account) => (
              <AccountCard key={account.id} account={account} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
          </DialogHeader>
          <CreateAccountForm
            onSuccess={() => setShowCreateModal(false)}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
