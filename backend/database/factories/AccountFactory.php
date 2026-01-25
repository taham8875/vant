<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'name' => fake()->words(2, true).' Account',
            'type' => fake()->randomElement(['checking', 'savings', 'credit_card', 'cash', 'investment']),
            'balance' => fake()->randomFloat(2, 0, 10000),
            'currency' => 'USD',
            'is_asset' => true,
        ];
    }
}
