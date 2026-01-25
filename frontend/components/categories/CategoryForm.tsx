'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import {
  useCreateCategory,
  useUpdateCategory,
  CreateCategoryData,
  Category,
} from '@/lib/hooks/useCategories';

interface CategoryFormProps {
  category?: Category;
  categories: Category[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({ category, categories, onSuccess, onCancel }: CategoryFormProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isEditing = !!category;

  const [formData, setFormData] = useState<CreateCategoryData>({
    name: category?.name || '',
    icon: category?.icon || '',
    parent_id: category?.parent_id || null,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon || '',
        parent_id: category.parent_id,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (isEditing) {
        await updateCategory.mutateAsync({ id: category.id, data: formData });
      } else {
        await createCategory.mutateAsync(formData);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ general: [error.message || `Failed to ${isEditing ? 'update' : 'create'} category`] });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === '' ? null : value });
  };

  // Get only parent categories (no children) for the parent dropdown
  const parentOptions = categories.filter(
    (cat) => cat.parent_id === null && (!isEditing || cat.id !== category?.id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormError errors={errors.general} />

      <FormField label="Category Name" htmlFor="name" required error={errors.name}>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Groceries"
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </FormField>

      <FormField label="Icon" htmlFor="icon" error={errors.icon}>
        <Input
          type="text"
          id="icon"
          name="icon"
          value={formData.icon || ''}
          onChange={handleChange}
          placeholder="e.g. shopping-cart"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </FormField>

      <FormField label="Parent Category" htmlFor="parent_id" error={errors.parent_id}>
        <select
          id="parent_id"
          name="parent_id"
          value={formData.parent_id || ''}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">None (Top-level category)</option>
          {parentOptions.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </FormField>

      <div className="flex gap-3">
        <Button
          type="submit"
          loading={createCategory.isPending || updateCategory.isPending}
          className="flex-1"
        >
          {isEditing ? 'Update Category' : 'Create Category'}
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
