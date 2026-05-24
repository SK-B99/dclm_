import { apiClient } from '../api-client';

export function adminGetAlbums(token: string) {
  return apiClient('/gallery/albums', { token });
}

export function adminCreateAlbum(token: string, data: any) {
  return apiClient('/gallery/albums', { method: 'POST', token, body: data });
}

export function adminDeleteAlbum(token: string, id: string) {
  return apiClient(`/gallery/albums/${id}`, { method: 'DELETE', token });
}

export function adminCreateMedia(token: string, data: any) {
  return apiClient('/gallery/media', { method: 'POST', token, body: data });
}

export function adminDeleteMedia(token: string, id: string) {
  return apiClient(`/gallery/media/${id}`, { method: 'DELETE', token });
}