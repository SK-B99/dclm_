import { apiClient } from '../api-client';

export function adminGetSermons(token: string) {
  return apiClient('/sermons', { token });
}

export function adminCreateSermon(token: string, data: any) {
  return apiClient('/sermons', { method: 'POST', token, body: data });
}

export function adminUpdateSermon(token: string, id: string, data: any) {
  return apiClient(`/sermons/${id}`, { method: 'PATCH', token, body: data });
}

export function adminDeleteSermon(token: string, id: string) {
  return apiClient(`/sermons/${id}`, { method: 'DELETE', token });
}