import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface Category {
  id: string;
  user_id: string | null;
  parent_id: string | null;
  name: string;
  icon: string | null;
  is_system: boolean;
  is_protected: boolean;
  display_order: number;
  can_edit: boolean;
  can_delete: boolean;
  created_at: string;
  updated_at: string;
  parent?: Category;
  children?: Category[];
}

export interface CreateCategoryData {
  name: string;
  icon?: string | null;
  parent_id?: string | null;
  display_order?: number;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string | null;
  parent_id?: string | null;
  display_order?: number;
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      return await apiClient.get<Category[]>('/v1/categories');
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      return await apiClient.post<Category>('/v1/categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryData }) => {
      return await apiClient.put<Category>(`/v1/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/v1/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
