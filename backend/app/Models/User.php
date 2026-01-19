<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'email',
        'password',
        'display_name',
        'google_id',
        'github_id',
        'subscription_tier',
        'notification_preferences',
        'failed_login_attempts',
        'locked_until',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'notification_preferences' => 'array',
            'failed_login_attempts' => 'integer',
            'locked_until' => 'datetime',
        ];
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function autoCategorization(): HasMany
    {
        return $this->hasMany(AutoCategorizationRule::class);
    }

    public function importBatches(): HasMany
    {
        return $this->hasMany(ImportBatch::class);
    }

    public function isFreeTier(): bool
    {
        return $this->subscription_tier === 'free';
    }

    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    public function incrementFailedLogins(): void
    {
        $this->failed_login_attempts++;

        if ($this->failed_login_attempts >= config('auth.lockout.max_attempts')) {
            $this->locked_until = now()->addMinutes(config('auth.lockout.decay_minutes'));
        }

        $this->save();
    }

    public function resetFailedLogins(): void
    {
        $this->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
        ]);
    }

    public function hasSocialLoginOnly(): bool
    {
        return is_null($this->password) && ($this->google_id || $this->github_id);
    }

    public function sendPasswordResetNotification($token): void
    {
        $url = config('app.frontend_url').'/auth/reset-password?token='.$token.'&email='.urlencode($this->email);
        $ipAddress = request()->ip() ?? 'Unknown';

        $this->notify(new ResetPasswordNotification($url, $ipAddress));
    }
}
