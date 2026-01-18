'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SocialAuth } from '@/components/auth/social-auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    display_name: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await register(
        formData.email,
        formData.password,
        formData.password_confirmation,
        formData.display_name
      );
      router.push('/dashboard');
    } catch (error) {
      const apiError = error as { errors?: Record<string, string[]>; message?: string };
      if (apiError.errors) {
        setErrors(apiError.errors);
      } else {
        setErrors({ general: [apiError.message || 'Registration failed'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthLayout
      heading="Create an account"
      subheading={
        <>
          Already have an account?{' '}
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
        <SocialAuth />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormError errors={errors.general} />

          <FormField
            label="Display Name"
            htmlFor="display_name"
            required
            error={errors.display_name}
          >
            <Input
              id="display_name"
              name="display_name"
              type="text"
              required
              value={formData.display_name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </FormField>

          <FormField label="Email address" htmlFor="email" required error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
          </FormField>

          <FormField label="Password" htmlFor="password" required error={errors.password}>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </FormField>

          <FormField label="Confirm Password" htmlFor="password_confirmation" required>
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </FormField>

          <Button type="submit" className="w-full" loading={isLoading} size="lg">
            Create Account
          </Button>
        </form>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
