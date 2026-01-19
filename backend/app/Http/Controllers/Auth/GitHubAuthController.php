<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\SocialAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class GitHubAuthController extends Controller
{
    public function redirect(): JsonResponse
    {
        $url = Socialite::driver('github')
            ->scopes(['user:email'])
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return $this->success(['url' => $url]);
    }

    public function callback(Request $request, SocialAuthService $socialAuthService): RedirectResponse
    {
        $frontendUrl = config('app.frontend_url');

        try {
            $githubUser = Socialite::driver('github')->stateless()->user();

            if (! $githubUser->getEmail()) {
                return redirect($socialAuthService->getErrorRedirectUrl($frontendUrl, 'email_required', 'github'));
            }

            $user = $socialAuthService->findOrCreateUser($githubUser, 'github');
            $redirectUrl = $socialAuthService->loginAndGetRedirectUrl($user, $frontendUrl, 'github');

            return redirect($redirectUrl);
        } catch (\Exception $e) {
            return redirect($socialAuthService->getErrorRedirectUrl($frontendUrl, 'oauth_failed', 'github'));
        }
    }
}
