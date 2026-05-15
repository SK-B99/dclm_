const API_URL = process.env.NEXT_PUBLIC_API_URL;

const headers = {
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json',
};

export async function getSermons() {
  const res = await fetch(`${API_URL}/sermons`, {
    next: { revalidate: 60 }, // rebuild every 60 seconds
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch sermons');
  return res.json();
}

export async function getSermon(id: string) {
  const res = await fetch(`${API_URL}/sermons/${id}`, {
    next: { revalidate: 60 },
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch sermon');
  return res.json();
}

export async function getEvents() {
  const res = await fetch(`${API_URL}/events`, {
    next: { revalidate: 60 },
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function getAnnouncements() {
  const res = await fetch(`${API_URL}/announcements`, {
    next: { revalidate: 60 },
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch announcements');
  return res.json();
}

export async function getGalleryAlbums() {
  const res = await fetch(`${API_URL}/gallery/albums`, {
    next: { revalidate: 60 },
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
}

export async function getChurchProfile() {
  const res = await fetch(`${API_URL}/church-profile`, {
    next: { revalidate: 60 },
    headers,
  });
  if (!res.ok) throw new Error('Failed to fetch church profile');
  return res.json();
}