<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\SocialAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(): JsonResponse
    {
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();

        return $this->success(['url' => $url]);
    }

    public function callback(Request $request, SocialAuthService $socialAuthService): RedirectResponse
    {
        $frontendUrl = config('app.frontend_url');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            if (! $googleUser->getEmail()) {
                return redirect($socialAuthService->getErrorRedirectUrl($frontendUrl, 'email_required', 'google'));
            }

            $user = $socialAuthService->findOrCreateUser($googleUser, 'google');
            $redirectUrl = $socialAuthService->loginAndGetRedirectUrl($user, $frontendUrl, 'google');

            return redirect($redirectUrl);
        } catch (\Exception $e) {
            return redirect($socialAuthService->getErrorRedirectUrl($frontendUrl, 'oauth_failed', 'google'));
        }
    }
}
