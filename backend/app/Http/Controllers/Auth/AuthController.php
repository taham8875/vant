<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'email' => $request->email,
            'password' => $request->password,
            'display_name' => $request->display_name,
            'subscription_tier' => 'free',
            'notification_preferences' => default_notification_preferences(),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return $this->created(new UserResource($user), 'Registration successful');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return $this->error('Invalid credentials', 401);
        }

        if ($user->isLocked()) {
            return $this->error('Account is locked. Please try again later.', 423);
        }

        if (! Hash::check($request->password, $user->password)) {
            $user->incrementFailedLogins();

            return $this->error('Invalid credentials', 401);
        }

        $user->resetFailedLogins();

        Auth::login($user, $request->boolean('remember', false));

        return $this->success(new UserResource($user), 'Login successful');
    }

    public function logout(): JsonResponse
    {
        Auth::logout();

        if (request()->hasSession()) {
            request()->session()->invalidate();
            request()->session()->regenerateToken();
        }

        return $this->success(null, 'Logout successful');
    }
}
