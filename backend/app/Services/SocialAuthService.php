<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class SocialAuthService
{
    /**
     * Find or create a user based on OAuth provider data.
     *
     * @param  string  $provider  'google' or 'github'
     */
    public function findOrCreateUser(SocialiteUser $socialUser, string $provider): User
    {
        return DB::transaction(function () use ($socialUser, $provider) {
            $providerIdColumn = $provider.'_id';

            // First, try to find user by provider ID
            $user = User::where($providerIdColumn, $socialUser->getId())->first();

            if ($user) {
                return $user;
            }

            // Find or create user by email, then link provider ID if needed
            $user = User::firstOrCreate(
                ['email' => $socialUser->getEmail()],
                [
                    'display_name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                    'email_verified_at' => now(),
                    'subscription_tier' => 'free',
                    'notification_preferences' => default_notification_preferences(),
                ]
            );

            // Link provider ID if not already set
            if (! $user->$providerIdColumn) {
                $user->update([$providerIdColumn => $socialUser->getId()]);
            }

            return $user;
        });
    }

    /**
     * Log in the user and return redirect URL.
     */
    public function loginAndGetRedirectUrl(User $user, string $frontendUrl, string $provider): string
    {
        Auth::login($user);

        return $frontendUrl.'/auth/callback/'.$provider.'?success=true';
    }

    /**
     * Get error redirect URL.
     */
    public function getErrorRedirectUrl(string $frontendUrl, string $error, string $provider): string
    {
        return $frontendUrl.'/auth/callback/'.$provider.'?error='.urlencode($error);
    }
}
