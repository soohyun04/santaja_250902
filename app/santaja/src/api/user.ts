import { api } from './client';

export const checkIdDuplicate = (loginId: string) =>
  api.get<{ available: boolean }>('/users/check-id', { params: { loginId } });

export const checkEmailDuplicate = (email: string) =>
  api.get<{ available: boolean }>('/users/check-email', { params: { email } });

export const checkNameDuplicate = (nickname: string) =>
  api.get<{ available: boolean }>('/users/check-name', { params: { nickname } });

export const signupUser = (formData: FormData) =>
  api.post('/users/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
