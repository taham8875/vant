import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/hooks/useTransactions';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils/formatters';

interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

type TransactionType = Transaction['type'];

export function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      income: 'text-green-600 dark:text-green-400',
      expense: 'text-red-600 dark:text-red-400',
      transfer: 'text-blue-600 dark:text-blue-400',
    };
    return colors[type] || 'text-muted-foreground';
  };

  const getAmountColor = (type: TransactionType) => {
    return type === 'income'
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-start space-x-4">
          <div
            className={`p-2 rounded-full ${
              transaction.type === 'income'
                ? 'bg-green-100 dark:bg-green-900/20'
                : transaction.type === 'expense'
                  ? 'bg-red-100 dark:bg-red-900/20'
                  : 'bg-blue-100 dark:bg-blue-900/20'
            }`}
          >
            {transaction.type === 'income' ? (
              <svg
                className={`w-6 h-6 ${getTypeColor(transaction.type)}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            ) : transaction.type === 'expense' ? (
              <svg
                className={`w-6 h-6 ${getTypeColor(transaction.type)}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 13l-5 5m0 0l-5-5m5 5V6"
                />
              </svg>
            ) : (
              <svg
                className={`w-6 h-6 ${getTypeColor(transaction.type)}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-foreground">{transaction.payee || 'No Payee'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {transaction.category?.name || 'Uncategorized'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(transaction.date)} • {transaction.account?.name}
            </div>
            {transaction.notes && (
              <p className="text-sm text-muted-foreground mt-2">{transaction.notes}</p>
            )}
          </div>
        </div>
        <div className="text-right w-full sm:w-auto">
          <div className={`text-lg font-bold ${getAmountColor(transaction.type)}`}>
            {transaction.type === 'income' ? '+' : ''}
            {transaction.type === 'expense' ? '-' : ''}
            {formatCurrency(parseFloat(transaction.amount))}
          </div>
          <div className="flex justify-end mt-2 space-x-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(transaction)}
                className="text-muted-foreground hover:text-foreground"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Delete
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Created {formatRelativeTime(transaction.created_at)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
