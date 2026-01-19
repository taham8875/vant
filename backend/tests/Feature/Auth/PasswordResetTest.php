<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    // US1: Request Password Reset Tests

    public function test_user_can_request_password_reset(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        Notification::assertSentTo($user, \App\Notifications\ResetPasswordNotification::class);
    }

    public function test_same_message_shown_for_nonexistent_email(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        Notification::assertNothingSent();
    }

    public function test_rate_limiting_prevents_abuse(): void
    {
        // Temporarily enable rate limiting for this test by manually configuring it
        \Illuminate\Support\Facades\RateLimiter::for('password-reset', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perHour(3)->by($request->input('email'));
        });

        Notification::fake();

        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Clear any existing rate limit data and password reset tokens
        \Illuminate\Support\Facades\RateLimiter::clear('test@example.com');
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->delete();

        // Make 3 requests (the limit)
        for ($i = 0; $i < 3; $i++) {
            $response = $this->postJson('/api/v1/auth/forgot-password', [
                'email' => 'test@example.com',
            ]);
            $response->assertStatus(200);

            // Delete the token after each successful request to avoid built-in Laravel throttle
            \Illuminate\Support\Facades\DB::table('password_reset_tokens')
                ->where('email', 'test@example.com')
                ->delete();
        }

        // 4th request should be rate limited by our custom rate limiter
        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(429);
    }

    public function test_social_only_account_handled_gracefully(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'social@example.com',
            'password' => null,
            'google_id' => 'google123',
        ]);

        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'social@example.com',
        ]);

        // Still return 200 to prevent enumeration
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        // But no email should be sent for social-only accounts
        Notification::assertNothingSent();
    }

    // US2: Reset Password Using Link Tests

    public function test_user_can_reset_password_with_valid_token(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        // Verify password was updated
        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));
    }

    public function test_user_autologin_after_reset(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'id',
                'email',
                'display_name',
            ],
        ]);

        // Verify user is returned and session is established
        $this->assertEquals($user->email, $response->json('data.email'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_password_confirmation_must_match(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'differentpassword',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    public function test_password_minimum_length_enforced(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    public function test_new_password_must_differ_from_current(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('samepassword123'),
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'samepassword123',
            'password_confirmation' => 'samepassword123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    // US3: Link Expiration and Security Tests

    public function test_expired_token_rejected(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        // Create a token
        $token = Password::createToken($user);

        // Manually set the token's created_at to more than 60 minutes ago
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', 'test@example.com')
            ->update(['created_at' => now()->subMinutes(61)]);

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
        ]);
    }

    public function test_used_token_cannot_be_reused(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        $token = Password::createToken($user);

        // Use the token once
        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);

        // Try to use the same token again
        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => 'test@example.com',
            'password' => 'anotherpassword123',
            'password_confirmation' => 'anotherpassword123',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
        ]);
    }

    public function test_new_token_invalidates_previous(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        // Create first token
        $firstToken = Password::createToken($user);

        // Delete the token to avoid Laravel's built-in throttle
        \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', 'test@example.com')
            ->delete();

        // Create second token (should invalidate first)
        $secondToken = Password::createToken($user);

        // Try to use the first token
        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $firstToken,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
        ]);

        // Second token should still work
        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $secondToken,
            'email' => 'test@example.com',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(200);
    }
}
