import { apiClient } from '../api-client';

export function adminGetChurchProfile(token: string) {
  return apiClient('/church-profile', { token });
}

export function adminUpdateChurchProfile(token: string, data: any) {
  return apiClient('/church-profile', { method: 'POST', token, body: data });
}