<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'account_id' => \App\Models\Account::factory(),
            'category_id' => \App\Models\Category::factory(),
            'type' => fake()->randomElement(['income', 'expense']),
            'amount' => fake()->randomFloat(2, 1, 1000),
            'date' => fake()->dateTimeBetween('-1 year', 'now'),
            'payee' => fake()->company(),
            'notes' => fake()->optional()->sentence(),
            'is_duplicate_flagged' => false,
        ];
    }
}
