import { apiClient } from '../api-client';

export function adminGetAnnouncements(token: string) {
  return apiClient('/announcements', { token });
}

export function adminCreateAnnouncement(token: string, data: any) {
  return apiClient('/announcements', { method: 'POST', token, body: data });
}

export function adminUpdateAnnouncement(token: string, id: string, data: any) {
  return apiClient(`/announcements/${id}`, { method: 'PATCH', token, body: data });
}

export function adminDeleteAnnouncement(token: string, id: string) {
  return apiClient(`/announcements/${id}`, { method: 'DELETE', token });
}