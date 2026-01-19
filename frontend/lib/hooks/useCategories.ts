import { useQuery } from '@tanstack/react-query';
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
  created_at: string;
  updated_at: string;
  parent?: Category;
  children?: Category[];
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      return await apiClient.get<Category[]>('/v1/categories');
    },
  });
}
