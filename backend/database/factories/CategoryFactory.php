<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null,
            'parent_id' => null,
            'name' => fake()->words(2, true),
            'icon' => fake()->randomElement(['shopping', 'food', 'transport', 'entertainment', 'utilities']),
            'is_system' => true,
            'is_protected' => false,
            'display_order' => 0,
        ];
    }
}
