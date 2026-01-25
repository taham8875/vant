<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Housing',
                'icon' => 'home',
                'subcategories' => ['Rent/Mortgage', 'Utilities', 'Maintenance'],
            ],
            [
                'name' => 'Transportation',
                'icon' => 'car',
                'subcategories' => ['Gas', 'Public Transit', 'Car Payment', 'Parking'],
            ],
            [
                'name' => 'Food & Dining',
                'icon' => 'restaurant',
                'subcategories' => ['Groceries', 'Restaurants', 'Coffee'],
            ],
            [
                'name' => 'Utilities',
                'icon' => 'bolt',
                'subcategories' => ['Electric', 'Water', 'Internet', 'Phone'],
            ],
            [
                'name' => 'Healthcare',
                'icon' => 'medical',
                'subcategories' => ['Insurance', 'Doctor', 'Pharmacy'],
            ],
            [
                'name' => 'Entertainment',
                'icon' => 'gamepad',
                'subcategories' => ['Streaming', 'Events', 'Hobbies'],
            ],
            [
                'name' => 'Shopping',
                'icon' => 'shopping-cart',
                'subcategories' => ['Clothing', 'Electronics', 'Home'],
            ],
            [
                'name' => 'Income',
                'icon' => 'dollar',
                'subcategories' => ['Salary', 'Freelance', 'Investments', 'Other'],
            ],
            [
                'name' => 'Transfers',
                'icon' => 'exchange',
                'subcategories' => [],
            ],
            [
                'name' => 'Uncategorized',
                'icon' => 'question',
                'subcategories' => [],
                'is_protected' => true,
            ],
        ];

        $displayOrder = 0;

        foreach ($categories as $category) {
            $parentId = Str::uuid()->toString();

            DB::table('categories')->insert([
                'id' => $parentId,
                'user_id' => null,
                'parent_id' => null,
                'name' => $category['name'],
                'icon' => $category['icon'],
                'is_system' => true,
                'is_protected' => $category['is_protected'] ?? false,
                'display_order' => $displayOrder++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($category['subcategories'] as $subcategory) {
                DB::table('categories')->insert([
                    'id' => Str::uuid()->toString(),
                    'user_id' => null,
                    'parent_id' => $parentId,
                    'name' => $subcategory,
                    'icon' => null,
                    'is_system' => true,
                    'is_protected' => false,
                    'display_order' => $displayOrder++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
