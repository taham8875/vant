<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
        $this->configurePasswordReset();
    }

    /**
     * Configure rate limiting for the application.
     */
    protected function configureRateLimiting(): void
    {
        if (config('auth.passwords.rate_limiting_enabled')) {
            RateLimiter::for('password-reset', function (Request $request) {
                return Limit::perHour(3)->by($request->input('email'));
            });
        } else {
            RateLimiter::for('password-reset', function (Request $request) {
                return Limit::none();
            });
        }

        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(config('auth.rate_limiting.login_attempts_per_minute'))
                ->by($request->ip());
        });
    }

    /**
     * Configure password reset URL for frontend SPA.
     */
    protected function configurePasswordReset(): void
    {
        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return config('app.frontend_url').'/auth/reset-password?token='.$token.'&email='.urlencode($user->email);
        });
    }
}
