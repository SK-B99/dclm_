'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminGetEvents, adminCreateEvent, adminUpdateEvent, adminDeleteEvent } from '@/lib/admin/events.api';

const empty = {
  title: '', description: '', location: '', address: '',
  startDate: '', endDate: '', status: 'UPCOMING', coverUrl: '',
};

const fields = [
  { label: 'Title *', key: 'title', type: 'text', required: true },
  { label: 'Start Date *', key: 'startDate', type: 'datetime-local', required: true },
  { label: 'End Date', key: 'endDate', type: 'datetime-local' },
  { label: 'Location', key: 'location', type: 'text' },
  { label: 'Address', key: 'address', type: 'text' },
  { label: 'Cover Image URL', key: 'coverUrl', type: 'url' },
];

export default function AdminEventsPage() {
  const { token, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

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

  const buildPayload = (f: any) => ({
    ...f,
    endDate: f.endDate || undefined,
    description: f.description || undefined,
    location: f.location || undefined,
    address: f.address || undefined,
    coverUrl: f.coverUrl || undefined,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminCreateEvent(token!, buildPayload(form));
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

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminUpdateEvent(token!, editingId!, buildPayload(editForm));
      setMessage('Event updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchEvents();
    } catch {
      setMessage('Failed to update event.');
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

  const startEdit = (e: any) => {
    setEditingId(e.id);
    setEditForm({
      title: e.title || '',
      description: e.description || '',
      location: e.location || '',
      address: e.address || '',
      startDate: e.startDate ? new Date(e.startDate).toISOString().slice(0, 16) : '',
      endDate: e.endDate ? new Date(e.endDate).toISOString().slice(0, 16) : '',
      status: e.status || 'UPCOMING',
      coverUrl: e.coverUrl || '',
    });
    setShowForm(false);
  };

  const renderFields = (formData: any, setFormData: any) => (
    <>
      {fields.map(({ label, key, type, required }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input type={type} required={required}
            value={formData[key] || ''}
            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea rows={3} value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select value={formData.status || 'UPCOMING'}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </>
  );

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
          <div className={`px-4 py-3 rounded-lg mb-6 text-sm ${
            message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}

        <button onClick={() => { setShowForm(!showForm); setEditingId(null); }}
          className="mb-6 bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition text-sm font-bold">
          {showForm ? 'Cancel' : '+ New Event'}
        </button>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
            <h2 className="text-lg font-bold text-blue-900 mb-2">New Event</h2>
            {renderFields(form, setForm)}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Event'}
            </button>
          </form>
        )}

        {/* Edit Form */}
        {editingId && (
          <form onSubmit={handleEdit} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4 border-2 border-yellow-400">
            <h2 className="text-lg font-bold text-yellow-600 mb-2">✏️ Edit Event</h2>
            {renderFields(editForm, setEditForm)}
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
                {loading ? 'Saving...' : 'Update Event'}
              </button>
              <button type="button" onClick={() => setEditingId(null)}
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Events List */}
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
                  <span className={`text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block ${
                    e.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                    e.status === 'ONGOING' ? 'bg-green-100 text-green-700' :
                    e.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{e.status}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(e)}
                    className="text-yellow-500 hover:text-yellow-700 text-sm font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(e.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}