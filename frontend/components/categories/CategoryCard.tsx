'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/hooks/useCategories';

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  level?: number;
}

export function CategoryCard({ category, onEdit, onDelete, level = 0 }: CategoryCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${level > 0 ? 'ml-8 mt-2' : 'mt-3'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {category.icon && (
              <span className="text-2xl" title={category.icon}>
                {category.icon}
              </span>
            )}
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                {category.name}
                {category.is_system && (
                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded">
                    System
                  </span>
                )}
              </h3>
              {level > 0 && (
                <p className="text-xs text-muted-foreground">Subcategory</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {category.can_edit && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(category)}
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Button>
            )}
            {category.can_delete && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(category)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        </div>

        {/* Render children categories */}
        {category.children && category.children.length > 0 && (
          <div className="mt-2 space-y-1">
            {category.children.map((child) => (
              <CategoryCard
                key={child.id}
                category={child}
                onEdit={onEdit}
                onDelete={onDelete}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
