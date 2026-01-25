<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LoginLockout
{
    public function handle(Request $request, Closure $next): Response
    {
        // This middleware is primarily for rate limiting
        // The actual lockout logic is handled in AuthController
        // using the User model's isLocked() method
        return $next($request);
    }
}
