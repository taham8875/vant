'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { AuthLayout } from '@/components/auth/auth-layout';
import { forgotPassword } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setIsSuccess(false);

    try {
      await forgotPassword({ email });
      setIsSuccess(true);
      setEmail('');
    } catch (error) {
      const err = error as { errors?: Record<string, string[]>; message?: string };
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: [err.message || 'Failed to send reset link'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Forgot your password?"
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
        {isSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">
              If an account exists with this email, you will receive a password reset link shortly.
              Please check your email.
            </p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </FormField>

          <Button type="submit" className="w-full" loading={isLoading} size="lg">
            Send Reset Link
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            We&apos;ll send you an email with a link to reset your password.
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
