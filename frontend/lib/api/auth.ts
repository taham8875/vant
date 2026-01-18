import { apiClient, sanctumClient } from './client';

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  subscription_tier: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
  await sanctumClient.getCsrfToken();
  await apiClient.post('/v1/auth/forgot-password', data);
};

export const resetPassword = async (
  data: ResetPasswordData
): Promise<{ user: User; token: string }> => {
  await sanctumClient.getCsrfToken();
  const response = await apiClient.post<{ user: User; token: string }>(
    '/v1/auth/reset-password',
    data
  );
  return response;
};
