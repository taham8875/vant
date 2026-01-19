<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountBalanceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\CategorySeeder::class);
    }

    public function test_account_created_with_initial_balance_creates_opening_balance_transaction(): void
    {
        /** @var User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/accounts', [
                'name' => 'Test Account',
                'type' => 'checking',
                'balance' => 1000.00,
                'currency' => 'USD',
                'is_asset' => true,
            ]);

        $response->assertStatus(201);

        $account = Account::where('name', 'Test Account')->first();

        // Should have opening balance transaction
        $this->assertDatabaseHas('transactions', [
            'account_id' => $account->id,
            'payee' => 'Opening Balance',
            'type' => 'income',
            'amount' => '1000.00',
        ]);

        // Account balance should match initial balance
        $this->assertEquals('1000.00', $account->balance);
    }

    public function test_account_balance_calculated_correctly_after_expense(): void
    {
        /** @var User $user */
        $user = User::factory()->create();

        // Create account with $1000 initial balance
        $this->actingAs($user)
            ->postJson('/api/v1/accounts', [
                'name' => 'Test Account',
                'type' => 'checking',
                'balance' => 1000.00,
                'currency' => 'USD',
                'is_asset' => true,
            ])
            ->assertStatus(201);

        $account = Account::where('name', 'Test Account')->first();
        $category = Category::where('is_system', true)->first();

        // Add $50 expense
        $this->actingAs($user)
            ->postJson('/api/v1/transactions', [
                'account_id' => $account->id,
                'category_id' => $category->id,
                'type' => 'expense',
                'amount' => 50.00,
                'date' => now()->toDateString(),
                'payee' => 'Store',
            ]);

        $account->refresh();

        // Balance should be: 1000 (initial) - 50 (expense) = 950
        $this->assertEquals('950.00', $account->balance);
    }

    public function test_account_balance_calculated_correctly_after_income(): void
    {
        /** @var User $user */
        $user = User::factory()->create();

        // Create account with $1000 initial balance
        $this->actingAs($user)
            ->postJson('/api/v1/accounts', [
                'name' => 'Test Account',
                'type' => 'checking',
                'balance' => 1000.00,
                'currency' => 'USD',
                'is_asset' => true,
            ])
            ->assertStatus(201);

        $account = Account::where('name', 'Test Account')->first();
        $category = Category::where('is_system', true)->first();

        // Add $200 income
        $this->actingAs($user)
            ->postJson('/api/v1/transactions', [
                'account_id' => $account->id,
                'category_id' => $category->id,
                'type' => 'income',
                'amount' => 200.00,
                'date' => now()->toDateString(),
                'payee' => 'Salary',
            ]);

        $account->refresh();

        // Balance should be: 1000 (initial) + 200 (income) = 1200
        $this->assertEquals('1200.00', $account->balance);
    }

    public function test_credit_card_account_balance_with_initial_balance(): void
    {
        /** @var User $user */
        $user = User::factory()->create();

        // Create credit card with $2000 initial credit available
        $this->actingAs($user)
            ->postJson('/api/v1/accounts', [
                'name' => 'Credit Card',
                'type' => 'credit_card',
                'balance' => 2000.00,
                'currency' => 'USD',
                'is_asset' => false,
            ])
            ->assertStatus(201);

        $account = Account::where('name', 'Credit Card')->first();

        // Should have opening balance as income
        $this->assertDatabaseHas('transactions', [
            'account_id' => $account->id,
            'payee' => 'Opening Balance',
            'type' => 'income',
            'amount' => '2000.00',
        ]);

        // Balance should be 2000
        $this->assertEquals('2000.00', $account->balance);

        // Add $50 purchase (reduces available credit)
        $category = Category::where('is_system', true)->first();
        $this->actingAs($user)
            ->postJson('/api/v1/transactions', [
                'account_id' => $account->id,
                'category_id' => $category->id,
                'type' => 'expense',
                'amount' => 50.00,
                'date' => now()->toDateString(),
                'payee' => 'Store',
            ]);

        $account->refresh();

        // Balance should be: 2000 (initial) - 50 (purchase) = 1950
        $this->assertEquals('1950.00', $account->balance);
    }

    public function test_account_with_zero_initial_balance_works_correctly(): void
    {
        /** @var User $user */
        $user = User::factory()->create();

        // Create account with $0 initial balance
        $this->actingAs($user)
            ->postJson('/api/v1/accounts', [
                'name' => 'Test Account',
                'type' => 'checking',
                'balance' => 0,
                'currency' => 'USD',
                'is_asset' => true,
            ])
            ->assertStatus(201);

        $account = Account::where('name', 'Test Account')->first();

        // Should NOT have opening balance transaction
        $this->assertDatabaseMissing('transactions', [
            'account_id' => $account->id,
            'payee' => 'Opening Balance',
        ]);

        // Balance should be 0
        $this->assertEquals('0.00', $account->balance);
    }

    public function test_multiple_transactions_calculate_balance_correctly(): void
    {
        /** @var User $user */
        $user = User::factory()->create();

        // Create account with $1000 initial balance
        $this->actingAs($user)
            ->postJson('/api/v1/accounts', [
                'name' => 'Test Account',
                'type' => 'checking',
                'balance' => 1000.00,
                'currency' => 'USD',
                'is_asset' => true,
            ])
            ->assertStatus(201);

        $account = Account::where('name', 'Test Account')->first();
        $category = Category::where('is_system', true)->first();

        // Add multiple transactions
        $this->actingAs($user)->postJson('/api/v1/transactions', [
            'account_id' => $account->id,
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => 100.00,
            'date' => now()->toDateString(),
            'payee' => 'Expense 1',
        ]);

        $this->actingAs($user)->postJson('/api/v1/transactions', [
            'account_id' => $account->id,
            'category_id' => $category->id,
            'type' => 'income',
            'amount' => 500.00,
            'date' => now()->toDateString(),
            'payee' => 'Income 1',
        ]);

        $this->actingAs($user)->postJson('/api/v1/transactions', [
            'account_id' => $account->id,
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => 250.00,
            'date' => now()->toDateString(),
            'payee' => 'Expense 2',
        ]);

        $account->refresh();

        // Balance: 1000 (initial) - 100 + 500 - 250 = 1150
        $this->assertEquals('1150.00', $account->balance);
    }
}
