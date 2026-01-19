<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Mockery;
use Tests\TestCase;

class GitHubAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_github_redirect_returns_valid_url(): void
    {
        $response = $this->get('/api/v1/auth/github/redirect');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => ['url'],
        ]);
        $this->assertTrue($response->json('success'));
        $this->assertStringContainsString('github.com', $response->json('data.url'));
    }

    public function test_github_callback_creates_new_user(): void
    {
        $socialiteUser = Mockery::mock('Laravel\Socialite\Two\User');
        $socialiteUser->shouldReceive('getId')->andReturn('github-123');
        $socialiteUser->shouldReceive('getEmail')->andReturn('newuser@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('New GitHub User');
        $socialiteUser->shouldReceive('getNickname')->andReturn('newgithubuser');

        $provider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('scopes')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('github')->andReturn($provider);

        $this->assertDatabaseMissing('users', ['email' => 'newuser@example.com']);

        $response = $this->get('/api/v1/auth/github/callback?code=test-code&state=test-state');

        $response->assertStatus(302);
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'github_id' => 'github-123',
            'display_name' => 'New GitHub User',
        ]);
        $this->assertAuthenticatedAs(User::where('email', 'newuser@example.com')->first());
    }

    public function test_github_callback_links_to_existing_user_by_email(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
            'github_id' => null,
        ]);

        $socialiteUser = Mockery::mock('Laravel\Socialite\Two\User');
        $socialiteUser->shouldReceive('getId')->andReturn('github-456');
        $socialiteUser->shouldReceive('getEmail')->andReturn('existing@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('Existing User');
        $socialiteUser->shouldReceive('getNickname')->andReturn('existinguser');

        $provider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('scopes')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('github')->andReturn($provider);

        $response = $this->get('/api/v1/auth/github/callback?code=test-code&state=test-state');

        $response->assertStatus(302);
        $existingUser->refresh();
        $this->assertEquals('github-456', $existingUser->github_id);
        $this->assertAuthenticatedAs($existingUser);
    }

    public function test_github_callback_logs_in_existing_oauth_user(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'oauth@example.com',
            'github_id' => 'github-789',
        ]);

        $socialiteUser = Mockery::mock('Laravel\Socialite\Two\User');
        $socialiteUser->shouldReceive('getId')->andReturn('github-789');
        $socialiteUser->shouldReceive('getEmail')->andReturn('oauth@example.com');
        $socialiteUser->shouldReceive('getName')->andReturn('OAuth User');
        $socialiteUser->shouldReceive('getNickname')->andReturn('oauthuser');

        $provider = Mockery::mock('Laravel\Socialite\Contracts\Provider');
        $provider->shouldReceive('stateless')->andReturnSelf();
        $provider->shouldReceive('scopes')->andReturnSelf();
        $provider->shouldReceive('user')->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')->with('github')->andReturn($provider);

        $response = $this->get('/api/v1/auth/github/callback?code=test-code&state=test-state');

        $response->assertStatus(302);
        $this->assertAuthenticatedAs($existingUser);
    }
}
