<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class PasswordResetController extends Controller
{
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        // If user doesn't exist or has social login only, still return success
        // to prevent email enumeration
        if (! $user || $user->hasSocialLoginOnly()) {
            return $this->success(
                null,
                'If an account exists with this email, you will receive a password reset link shortly.'
            );
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return $this->success(
                null,
                'If an account exists with this email, you will receive a password reset link shortly.'
            );
        }

        return $this->error(__($status), 400);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            $user = User::where('email', $request->email)->first();

            // Auto-login the user using session auth
            Auth::login($user);

            return $this->success(
                new UserResource($user),
                'Your password has been reset successfully.'
            );
        }

        return $this->error(__($status), 422);
    }
}
