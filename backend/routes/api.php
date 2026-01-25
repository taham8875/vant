<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// API Version 1
Route::prefix('v1')->group(function () {
    // Public routes (no authentication required)
    Route::prefix('auth')->group(function () {
        Route::post('/register', [App\Http\Controllers\Auth\AuthController::class, 'register']);
        Route::post('/login', [App\Http\Controllers\Auth\AuthController::class, 'login'])
            ->middleware('throttle:login');
        Route::post('/logout', [App\Http\Controllers\Auth\AuthController::class, 'logout']);

        // Password Reset
        Route::post('/forgot-password', [App\Http\Controllers\Auth\PasswordResetController::class, 'forgotPassword'])
            ->middleware('throttle:password-reset');
        Route::post('/reset-password', [App\Http\Controllers\Auth\PasswordResetController::class, 'resetPassword']);

        // Google OAuth
        Route::get('/google/redirect', [App\Http\Controllers\Auth\GoogleAuthController::class, 'redirect']);
        Route::get('/google/callback', [App\Http\Controllers\Auth\GoogleAuthController::class, 'callback']);

        // GitHub OAuth
        Route::get('/github/redirect', [App\Http\Controllers\Auth\GitHubAuthController::class, 'redirect']);
        Route::get('/github/callback', [App\Http\Controllers\Auth\GitHubAuthController::class, 'callback']);
    });

    // Email verification routes (require auth)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/email/verify/{id}/{hash}', [App\Http\Controllers\Auth\VerificationController::class, 'verify'])
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');
        Route::post('/email/resend', [App\Http\Controllers\Auth\VerificationController::class, 'resend'])
            ->middleware('throttle:6,1');
        Route::get('/email/check', [App\Http\Controllers\Auth\VerificationController::class, 'check']);
    });

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        // User routes
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Account routes
        Route::apiResource('accounts', App\Http\Controllers\AccountController::class);

        // Transaction routes
        Route::apiResource('transactions', App\Http\Controllers\TransactionController::class);
        Route::post('/transactions/transfer', [App\Http\Controllers\TransactionController::class, 'transfer']);
        Route::post('/transactions/bulk-categorize', [App\Http\Controllers\TransactionController::class, 'bulkCategorize']);

        // Category routes
        Route::apiResource('categories', App\Http\Controllers\CategoryController::class);
    });
});
