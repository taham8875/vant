'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmailVerifiedCallbackPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { refetchUser } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const { id, hash } = params;

      if (!id || !hash) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        return;
      }

      // Get query parameters for signed URL
      const expires = searchParams?.get('expires');
      const signature = searchParams?.get('signature');

      // Build URL with query parameters
      const queryParams = new URLSearchParams();
      if (expires) queryParams.append('expires', expires);
      if (signature) queryParams.append('signature', signature);
      const queryString = queryParams.toString();
      const url = `/v1/email/verify/${id}/${hash}${queryString ? `?${queryString}` : ''}`;

      // Call the backend verification endpoint
      await apiClient.get(url);

      setStatus('success');
      setMessage('Your email has been successfully verified!');

      // Refetch user data to update email_verified_at
      await refetchUser();

      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      setStatus('error');
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        'Verification failed. The link may have expired or already been used.';
      setMessage(errorMessage);
    }
  };

  const handleContinue = () => {
    if (status === 'success') {
      router.push('/dashboard');
    } else {
      router.push('/auth/verify-email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardContent className="space-y-6 p-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-foreground">
              {status === 'verifying' && 'Verifying your email'}
              {status === 'success' && 'Email verified!'}
              {status === 'error' && 'Verification failed'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {status === 'verifying' && 'Please wait while we verify your email address...'}
              {status === 'success' && 'Your account is now fully activated'}
              {status === 'error' && 'There was a problem verifying your email'}
            </p>
          </div>

          {/* Status Icon */}
          <div className="flex justify-center">
            {status === 'verifying' && (
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary" />
            )}
            {status === 'success' && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <svg
                  className="h-10 w-10 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg
                  className="h-10 w-10 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-lg border p-4 text-center ${
                status === 'success'
                  ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400'
                  : status === 'error'
                    ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400'
                    : 'border-muted bg-muted/50 text-muted-foreground'
              }`}
            >
              {message}
            </div>
          )}

          {/* Action Button */}
          {status !== 'verifying' && (
            <div className="space-y-3">
              {status === 'success' && (
                <p className="text-center text-sm text-muted-foreground">
                  Redirecting to dashboard in 2 seconds...
                </p>
              )}
              <Button onClick={handleContinue} variant="default" className="w-full">
                {status === 'success' ? 'Continue to Dashboard' : 'Back to Verification Page'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
