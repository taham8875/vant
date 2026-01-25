'use client';

import { useState } from 'react';
import { Category } from '@/lib/hooks/useCategories';
import { CategoryCard } from './CategoryCard';
import { Button } from '@/components/ui/button';

interface CategoryListProps {
  categories: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  const [showSystemCategories, setShowSystemCategories] = useState(false);

  // Separate system and user categories
  const systemCategories = categories.filter((cat) => cat.is_system && cat.parent_id === null);
  const userCategories = categories.filter((cat) => !cat.is_system && cat.parent_id === null);

  return (
    <div className="space-y-6">
      {/* System Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">System Categories</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSystemCategories(!showSystemCategories)}
            className="text-muted-foreground"
          >
            {showSystemCategories ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Hide
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Show
              </>
            )}
          </Button>
        </div>
        {showSystemCategories && (
          <div className="space-y-2">
            {systemCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No system categories found.</p>
            ) : (
              systemCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        )}
      </div>

      {/* User Categories Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">My Categories</h2>
        <div className="space-y-2">
          {userCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No custom categories yet. Click &quot;Add Category&quot; to create one.
            </p>
          ) : (
            userCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
