<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\CategorySeeder::class);
    }

    public function test_user_can_create_transaction(): void
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::where('is_system', true)->first();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/transactions', [
                'account_id' => $account->id,
                'category_id' => $category->id,
                'type' => 'expense',
                'amount' => 50.00,
                'date' => '2024-01-15',
                'payee' => 'Test Store',
                'notes' => 'Test purchase',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'account_id',
                    'category_id',
                    'type',
                    'amount',
                    'date',
                    'payee',
                ],
            ]);

        $this->assertDatabaseHas('transactions', [
            'account_id' => $account->id,
            'payee' => 'Test Store',
            'amount' => '50.00',
        ]);
    }

    public function test_transaction_creation_updates_account_balance(): void
    {
        $user = User::factory()->create();
        $account = Account::factory()->create([
            'user_id' => $user->id,
            'balance' => 1000.00,
        ]);
        $category = Category::where('is_system', true)->first();

        $this->actingAs($user)
            ->postJson('/api/v1/transactions', [
                'account_id' => $account->id,
                'category_id' => $category->id,
                'type' => 'expense',
                'amount' => 50.00,
                'date' => '2024-01-15',
                'payee' => 'Test Payee',
            ]);

        $account->refresh();
        $this->assertEquals('-50.00', $account->balance);
    }

    public function test_user_cannot_create_transaction_for_another_users_account(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $otherUser->id]);
        $category = Category::where('is_system', true)->first();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/transactions', [
                'account_id' => $account->id,
                'category_id' => $category->id,
                'type' => 'expense',
                'amount' => 50.00,
                'date' => '2024-01-15',
                'payee' => 'Test Payee',
            ]);

        $response->assertStatus(403);
    }

    public function test_user_can_list_their_transactions(): void
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::where('is_system', true)->first();

        Transaction::factory()->count(5)->create([
            'account_id' => $account->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/transactions');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'data',
                    'meta' => [
                        'current_page',
                        'per_page',
                        'total',
                    ],
                ],
            ]);
    }

    public function test_user_can_filter_transactions_by_account(): void
    {
        $user = User::factory()->create();
        $account1 = Account::factory()->create(['user_id' => $user->id]);
        $account2 = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::where('is_system', true)->first();

        // Use dates within the last 6 months to ensure free tier users can see them
        Transaction::factory()->count(3)->create([
            'account_id' => $account1->id,
            'category_id' => $category->id,
            'date' => now()->subMonth(),
        ]);
        Transaction::factory()->count(2)->create([
            'account_id' => $account2->id,
            'category_id' => $category->id,
            'date' => now()->subMonth(),
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/v1/transactions?account_id={$account1->id}");

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data.data'));
    }

    public function test_user_can_update_transaction(): void
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::where('is_system', true)->first();
        $transaction = Transaction::factory()->create([
            'account_id' => $account->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)
            ->putJson("/api/v1/transactions/{$transaction->id}", [
                'amount' => 100.00,
                'payee' => 'Updated Payee',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'amount' => '100.00',
            'payee' => 'Updated Payee',
        ]);
    }

    public function test_user_cannot_update_another_users_transaction(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $otherUser->id]);
        $category = Category::where('is_system', true)->first();
        $transaction = Transaction::factory()->create([
            'account_id' => $account->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)
            ->putJson("/api/v1/transactions/{$transaction->id}", [
                'amount' => 999.99,
            ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_transaction(): void
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::where('is_system', true)->first();
        $transaction = Transaction::factory()->create([
            'account_id' => $account->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/v1/transactions/{$transaction->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('transactions', [
            'id' => $transaction->id,
        ]);
    }

    public function test_free_tier_users_only_see_six_months_history(): void
    {
        $user = User::factory()->create(['subscription_tier' => 'free']);
        $account = Account::factory()->create(['user_id' => $user->id]);
        $category = Category::where('is_system', true)->first();

        // Create old transaction (7 months ago)
        Transaction::factory()->create([
            'account_id' => $account->id,
            'category_id' => $category->id,
            'date' => now()->subMonths(7),
        ]);

        // Create recent transaction (3 months ago)
        Transaction::factory()->create([
            'account_id' => $account->id,
            'category_id' => $category->id,
            'date' => now()->subMonths(3),
        ]);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/transactions');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.data'));
    }
}
