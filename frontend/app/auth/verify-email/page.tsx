'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const response = await apiClient.get<{ data: { verified: boolean } }>('/v1/email/check');
      if (response.data.verified) {
        setIsVerified(true);
        setMessage('Your email is already verified!');
      }
    } catch (err) {
      console.error('Error checking verification status:', err);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await apiClient.post('/v1/email/resend');
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
    <Card className="max-w-md w-full">
      <CardContent className="space-y-8 p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Verify your email
          </h2>
          {isVerified ? (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Your email has been verified!
            </p>
          ) : (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              We need to verify your email address before you can continue.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!isVerified ? (
            <>
              <p className="text-sm text-muted-foreground">
                Please check your email and click the verification link to verify your account. If
                you didn&apos;t receive the email, you can request a new one.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleResend}
                  loading={isLoading}
                  variant="default"
                  className="w-full"
                >
                  Resend verification email
                </Button>

                <Button onClick={handleContinue} variant="secondary" className="w-full">
                  Continue to dashboard
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your email has been successfully verified. You can now access all features.
              </p>

              <Button onClick={handleContinue} variant="default" className="w-full">
                Continue to dashboard
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </div>;
}
