<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Mockery;
use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_google_redirect_returns_valid_url(): void
    {
        $response = $this->get('/api/v1/auth/google/redirect');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => ['url'],
        ]);
        $this->assertTrue($response->json('success'));
        $this->assertStringContainsString('accounts.google.com', $response->json('data.url'));
    }

    public function test_google_callback_creates_new_user(): void
    {
        $socialiteUser = Mockery::mock('Laravel\Socialite\Two\User');
        $socialiteUser->shouldReceive('getId')->andReturn('google-123');
        $socialiteUser->shouldReceive('getEmail')->andReturn('newuser@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('New User');
        $socialiteUser->shouldReceive('getNickname')->andReturn(null);

        $provider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $this->assertDatabaseMissing('users', ['email' => 'newuser@example.com']);

        $response = $this->get('/api/v1/auth/google/callback?code=test-code&state=test-state');

        $response->assertStatus(302);
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'google_id' => 'google-123',
            'display_name' => 'New User',
        ]);
        $this->assertAuthenticatedAs(User::where('email', 'newuser@example.com')->first());
    }

    public function test_google_callback_links_to_existing_user_by_email(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
            'google_id' => null,
        ]);

        $socialiteUser = Mockery::mock('Laravel\Socialite\Two\User');
        $socialiteUser->shouldReceive('getId')->andReturn('google-456');
        $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('Existing User');
        $socialiteUser->shouldReceive('getNickname')->andReturn(null);

        $provider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/api/v1/auth/google/callback?code=test-code&state=test-state');

        $response->assertStatus(302);
        $existingUser->refresh();
        $this->assertEquals('google-456', $existingUser->google_id);
        $this->assertAuthenticatedAs($existingUser);
    }

    public function test_google_callback_logs_in_existing_oauth_user(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'oauth@example.com',
            'google_id' => 'google-789',
        ]);

        $socialiteUser = Mockery::mock('Laravel\Socialite\Two\User');
        $socialiteUser->shouldReceive('getId')->andReturn('google-789');
        $socialiteUser->shouldReceive('getEmail')->andReturn('oauth@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('OAuth User');
        $socialiteUser->shouldReceive('getNickname')->andReturn(null);

        $provider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/api/v1/auth/google/callback?code=test-code&state=test-state');

        $response->assertStatus(302);
        $this->assertAuthenticatedAs($existingUser);
    }
}
