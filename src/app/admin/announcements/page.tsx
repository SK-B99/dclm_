'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminGetAnnouncements, adminCreateAnnouncement, adminUpdateAnnouncement, adminDeleteAnnouncement } from '@/lib/admin/announcements.api';

const empty = { title: '', body: '', isPublished: true, expiresAt: '' };

export default function AdminAnnouncementsPage() {
  const { token, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    if (!isAuthenticated) router.push('/admin');
    else fetchItems();
  }, [isAuthenticated]);

  const fetchItems = async () => {
    try {
      const data = await adminGetAnnouncements(token!);
      setItems(data);
    } catch {}
  };

  const buildPayload = (f: any) => ({
    ...f,
    expiresAt: f.expiresAt || undefined,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminCreateAnnouncement(token!, buildPayload(form));
      setMessage('Announcement created successfully!');
      setForm(empty);
      setShowForm(false);
      fetchItems();
    } catch {
      setMessage('Failed to create announcement.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminUpdateAnnouncement(token!, editingId!, buildPayload(editForm));
      setMessage('Announcement updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchItems();
    } catch {
      setMessage('Failed to update announcement.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await adminDeleteAnnouncement(token!, id);
      fetchItems();
    } catch {}
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title || '',
      body: item.body || '',
      isPublished: item.isPublished ?? true,
      expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : '',
    });
    setShowForm(false);
  };

  const renderFields = (formData: any, setFormData: any) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input type="text" required value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body *</label>
        <textarea rows={4} required value={formData.body || ''}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
        <input type="datetime-local" value={formData.expiresAt || ''}
          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isPublished" checked={formData.isPublished ?? true}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="isPublished" className="text-sm text-gray-700">
          Publish immediately
        </label>
      </div>
    </>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Manage Announcements</h1>
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
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
            <h2 className="text-lg font-bold text-blue-900 mb-2">New Announcement</h2>
            {renderFields(form, setForm)}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Announcement'}
            </button>
          </form>
        )}

        {/* Edit Form */}
        {editingId && (
          <form onSubmit={handleEdit} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4 border-2 border-yellow-400">
            <h2 className="text-lg font-bold text-yellow-600 mb-2">✏️ Edit Announcement</h2>
            {renderFields(editForm, setEditForm)}
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
                {loading ? 'Saving...' : 'Update Announcement'}
              </button>
              <button type="button" onClick={() => setEditingId(null)}
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No announcements yet.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-blue-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.body}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${
                    item.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.isPublished ? 'Published' : 'Unpublished'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(item)}
                    className="text-yellow-500 hover:text-yellow-700 text-sm font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}
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