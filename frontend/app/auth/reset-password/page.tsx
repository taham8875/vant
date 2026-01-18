'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { AuthLayout } from '@/components/auth/auth-layout';
import { resetPassword } from '@/lib/api/auth';
import { useAuth } from '@/lib/auth/AuthContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchUser } = useAuth();
  const [formData, setFormData] = useState({
    token: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token && email) {
      setFormData((prev) => ({
        ...prev,
        token,
        email,
      }));
    } else {
      // If no token or email in URL, redirect to forgot password page
      router.push('/auth/forgot-password');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await resetPassword(formData);

      // Auto-login the user by storing the token and refetching user data
      localStorage.setItem('token', response.token);
      await refetchUser();

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      const err = error as { errors?: Record<string, string[]>; message?: string };
      if (err.errors) {
        setErrors(err.errors);
      } else {
        const message = err.message || 'Failed to reset password';
        setErrors({ general: [message] });

        // Check if error message indicates expired/invalid token
        if (
          message.toLowerCase().includes('expired') ||
          message.toLowerCase().includes('invalid')
        ) {
          setIsTokenExpired(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Reset your password"
      subheading={
        <>
          Remember your password?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/90 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <div className="grid gap-6">
        {isTokenExpired && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800 mb-2">
              This password reset link has expired or is invalid.
            </p>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-red-600 hover:text-red-500 underline"
            >
              Request a new password reset link
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormError errors={errors.general} />

          <FormField label="Email" htmlFor="email" required error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              disabled
            />
          </FormField>

          <FormField label="New Password" htmlFor="password" required error={errors.password}>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </FormField>

          <FormField
            label="Confirm Password"
            htmlFor="password_confirmation"
            required
            error={errors.password_confirmation}
          >
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
              placeholder="••••••••"
            />
          </FormField>

          <Button type="submit" className="w-full" loading={isLoading} size="lg">
            Reset Password
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Your password must be at least 8 characters long.
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
