'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams?.get('success');
    const errorParam = searchParams?.get('error');

    if (success === 'true') {
      // OAuth succeeded, refresh user data and redirect to dashboard
      refetchUser()
        .then(() => {
          router.push('/dashboard');
        })
        .catch((err) => {
          console.error('Failed to fetch user after OAuth:', err);
          setError('Failed to complete sign in. Please try again.');
        });
    } else if (errorParam) {
      // OAuth failed, display error
      const errorMessages: Record<string, string> = {
        access_denied:
          'You denied access to your account. Please try again if you want to sign in.',
        oauth_failed: 'Authentication failed. Please try again.',
        email_required:
          'We could not retrieve your email address. Please ensure your email is public or grant email access.',
        provider_error:
          'The authentication provider is currently unavailable. Please try again later.',
      };

      setError(errorMessages[errorParam] || 'An unknown error occurred. Please try again.');
    } else {
      // No success or error parameter, redirect to login
      router.push('/auth/login');
    }
  }, [searchParams, refetchUser, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-800">Sign In Failed</h2>
          <p className="mb-4 text-red-700">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-lg text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
