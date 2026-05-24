import { apiClient } from '../api-client';

export function adminGetEvents(token: string) {
  return apiClient('/events', { token });
}

export function adminCreateEvent(token: string, data: any) {
  return apiClient('/events', { method: 'POST', token, body: data });
}

export function adminUpdateEvent(token: string, id: string, data: any) {
  return apiClient(`/events/${id}`, { method: 'PATCH', token, body: data });
}

export function adminDeleteEvent(token: string, id: string) {
  return apiClient(`/events/${id}`, { method: 'DELETE', token });
}