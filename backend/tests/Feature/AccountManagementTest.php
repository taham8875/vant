<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_account(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/accounts', [
                'name' => 'My Checking Account',
                'type' => 'checking',
                'balance' => 1000.00,
                'currency' => 'USD',
                'is_asset' => true,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'type',
                    'balance',
                    'currency',
                    'is_asset',
                ],
            ]);

        $this->assertDatabaseHas('accounts', [
            'user_id' => $user->id,
            'name' => 'My Checking Account',
            'type' => 'checking',
        ]);
    }

    public function test_free_tier_user_cannot_create_more_than_two_accounts(): void
    {
        $user = User::factory()->create(['subscription_tier' => 'free']);

        // Create 2 accounts
        Account::factory()->count(2)->create(['user_id' => $user->id]);

        // Try to create 3rd account
        $response = $this->actingAs($user)
            ->postJson('/api/v1/accounts', [
                'name' => 'Third Account',
                'type' => 'savings',
                'balance' => 500.00,
                'currency' => 'USD',
                'is_asset' => true,
            ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'Free tier users can only create up to 2 accounts. Please upgrade to create more.']);
    }

    public function test_user_can_list_their_accounts(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Account::factory()->count(3)->create(['user_id' => $user->id]);
        Account::factory()->count(2)->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->getJson('/api/v1/accounts');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_update_their_account(): void
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->putJson("/api/v1/accounts/{$account->id}", [
                'name' => 'Updated Account Name',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('accounts', [
            'id' => $account->id,
            'name' => 'Updated Account Name',
        ]);
    }

    public function test_user_cannot_update_another_users_account(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->putJson("/api/v1/accounts/{$account->id}", [
                'name' => 'Hacked Name',
            ]);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/v1/accounts/{$account->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('accounts', [
            'id' => $account->id,
        ]);
    }

    public function test_user_cannot_delete_another_users_account(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)
            ->deleteJson("/api/v1/accounts/{$account->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('accounts', [
            'id' => $account->id,
        ]);
    }

    public function test_account_requires_valid_type(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/v1/accounts', [
                'name' => 'Test Account',
                'type' => 'invalid',
                'balance' => 1000.00,
                'currency' => 'USD',
                'is_asset' => true,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('type');
    }
}
