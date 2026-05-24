import { apiClient } from '../api-client';

export function loginAdmin(email: string, password: string) {
  return apiClient('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}