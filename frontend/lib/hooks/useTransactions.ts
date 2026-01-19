import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface Transaction {
  id: string;
  account_id: string;
  category_id: string;
  linked_transaction_id: string | null;
  type: 'income' | 'expense' | 'transfer';
  amount: string;
  date: string;
  payee: string | null;
  notes: string | null;
  is_duplicate_flagged: boolean;
  import_batch_id: string | null;
  created_at: string;
  updated_at: string;
  account?: any;
  category?: any;
}

export interface CreateTransactionData {
  account_id: string;
  category_id: string;
  type: string;
  amount: number;
  date: string;
  payee?: string;
  notes?: string;
  linked_transaction_id?: string;
}

export interface UpdateTransactionData {
  account_id?: string;
  category_id?: string;
  type?: string;
  amount?: number;
  date?: string;
  payee?: string;
  notes?: string;
  linked_transaction_id?: string;
}

export interface TransactionFilters {
  account_id?: string;
  category_id?: string;
  type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  per_page?: number;
}

export function useTransactions(filters?: TransactionFilters) {
  const queryKey = ['transactions', filters];

  return useQuery<{ data: Transaction[]; meta: any }>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, value.toString());
          }
        });
      }
      const queryString = params.toString();
      const endpoint = queryString ? `/v1/transactions?${queryString}` : '/v1/transactions';
      return await apiClient.get<{ data: Transaction[]; meta: any }>(endpoint);
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransactionData) => {
      return await apiClient.post<Transaction>('/v1/transactions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTransactionData }) => {
      return await apiClient.put<Transaction>(`/v1/transactions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/v1/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}

export interface CreateTransferData {
  from_account_id: string;
  to_account_id: string;
  amount: number;
  date: string;
  notes?: string;
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransferData) => {
      return await apiClient.post<{ expense: Transaction; income: Transaction }>(
        '/v1/transactions/transfer',
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
}
