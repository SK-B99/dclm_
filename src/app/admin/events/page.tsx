'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminGetEvents, adminCreateEvent, adminDeleteEvent } from '@/lib/admin/events.api';

const empty = {
  title: '', description: '', location: '', address: '',
  startDate: '', endDate: '', status: 'UPCOMING', coverUrl: '',
};

export default function AdminEventsPage() {
  const { token, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/admin');
    else fetchEvents();
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      const data = await adminGetEvents(token!);
      setEvents(data);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        endDate: form.endDate || undefined,
        description: form.description || undefined,
        location: form.location || undefined,
        address: form.address || undefined,
        coverUrl: form.coverUrl || undefined,
      };
      await adminCreateEvent(token!, payload);
      setMessage('Event created successfully!');
      setForm(empty);
      setShowForm(false);
      fetchEvents();
    } catch {
      setMessage('Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      await adminDeleteEvent(token!, id);
      fetchEvents();
    } catch {}
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Manage Events</h1>
        <button onClick={() => router.push('/admin/dashboard')}
          className="text-sm bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
          ← Dashboard
        </button>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">{message}</div>
        )}
        <button onClick={() => setShowForm(!showForm)}
          className="mb-6 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition text-sm font-bold">
          {showForm ? 'Cancel' : '+ New Event'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
            <h2 className="text-lg font-bold text-blue-900 mb-2">New Event</h2>
            {[
              { label: 'Title *', key: 'title', type: 'text', required: true },
              { label: 'Start Date *', key: 'startDate', type: 'datetime-local', required: true },
              { label: 'End Date', key: 'endDate', type: 'datetime-local' },
              { label: 'Location', key: 'location', type: 'text' },
              { label: 'Address', key: 'address', type: 'text' },
              { label: 'Cover Image URL', key: 'coverUrl', type: 'url' },
            ].map(({ label, key, type, required }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} required={required}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Event'}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {events.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No events yet.</p>
          ) : (
            events.map((e) => (
              <div key={e.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-blue-900">{e.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(e.startDate).toDateString()}</p>
                  {e.location && <p className="text-sm text-gray-400">{e.location}</p>}
                </div>
                <button onClick={() => handleDelete(e.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium">
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}