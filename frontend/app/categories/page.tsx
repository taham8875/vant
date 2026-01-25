'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CategoryList } from '@/components/categories/CategoryList';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { useCategories, useDeleteCategory, Category } from '@/lib/hooks/useCategories';

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDelete = async (category: Category) => {
    if (
      confirm(
        `Are you sure you want to delete "${category.name}"? All transactions in this category will be moved to "Uncategorized".`
      )
    ) {
      try {
        await deleteCategory.mutateAsync(category.id);
      } catch (error: any) {
        alert(error.message || 'Failed to delete category');
      }
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-600 dark:text-red-400 py-8">
          Error loading categories. Please try again.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Categories</h1>
            <p className="mt-2 text-muted-foreground">Manage your spending categories</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>Add Category</Button>
        </div>

        <CategoryList categories={categories || []} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Create Category Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            categories={categories || []}
            onSuccess={() => setShowCreateModal(false)}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory || undefined}
            categories={categories || []}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedCategory(null);
            }}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedCategory(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
