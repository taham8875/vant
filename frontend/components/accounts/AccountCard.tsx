import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Account } from '@/lib/hooks/useAccounts';
import { formatCurrency } from '@/lib/utils/formatters';

interface AccountCardProps {
  account: Account;
  onDelete?: (account: Account) => void;
}

export function AccountCard({ account, onDelete }: AccountCardProps) {
  const getAccountTypeClasses = (type: Account['type']) => {
    const colors: Record<string, string> = {
      checking: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      savings: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      credit_card: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      cash: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      investment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  const getIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
      case 'savings':
      case 'investment':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-6 9 6M8 4.499l8-.998M8 17s1-1.12 1.995-1.12c1.333 0 2.052.88 2.052.88 1.516.96 2.052 0 2.052 0"
            />
          </svg>
        );
      case 'credit_card':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        );
      case 'cash':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${getAccountTypeClasses(account.type)}`}>
              {getIcon(account.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{account.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {account.type.replace('_', ' ')}
              </p>
            </div>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(account)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(parseFloat(account.balance), account.currency)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {account.is_asset ? 'Asset Account' : 'Liability Account'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
