'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminGetSermons, adminCreateSermon, adminUpdateSermon, adminDeleteSermon } from '@/lib/admin/sermons.api';
import ImageUpload from '@/components/admin/ImageUpload';

const empty = {
  title: '', description: '', scripture: '', date: '',
  speaker: '', audioUrl: '', videoUrl: '', thumbnailUrl: '',
  status: 'PUBLISHED', seriesId: '',
};

const fields = [
  { label: 'Title *', key: 'title', type: 'text', required: true },
  { label: 'Speaker *', key: 'speaker', type: 'text', required: true },
  { label: 'Date *', key: 'date', type: 'datetime-local', required: true },
  { label: 'Scripture', key: 'scripture', type: 'text' },
  { label: 'Audio URL', key: 'audioUrl', type: 'url' },
  { label: 'Video URL', key: 'videoUrl', type: 'url' },
];

export default function AdminSermonsPage() {
  const { token, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [sermons, setSermons] = useState<any[]>([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    if (!isAuthenticated) router.push('/admin');
    else fetchSermons();
  }, [isAuthenticated]);

  const fetchSermons = async () => {
    try {
      const data = await adminGetSermons(token!);
      setSermons(data);
    } catch {}
  };

  const buildPayload = (f: any) => ({
    ...f,
    audioUrl: f.audioUrl || undefined,
    videoUrl: f.videoUrl || undefined,
    thumbnailUrl: f.thumbnailUrl || undefined,
    seriesId: f.seriesId || undefined,
    description: f.description || undefined,
    scripture: f.scripture || undefined,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminCreateSermon(token!, buildPayload(form));
      setMessage('Sermon created successfully!');
      setForm(empty);
      setShowForm(false);
      fetchSermons();
    } catch {
      setMessage('Failed to create sermon.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminUpdateSermon(token!, editingId!, buildPayload(editForm));
      setMessage('Sermon updated successfully!');
      setEditingId(null);
      setEditForm({});
      fetchSermons();
    } catch {
      setMessage('Failed to update sermon.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sermon?')) return;
    try {
      await adminDeleteSermon(token!, id);
      fetchSermons();
    } catch {}
  };

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setEditForm({
      title: s.title || '',
      speaker: s.speaker || '',
      date: s.date ? new Date(s.date).toISOString().slice(0, 16) : '',
      scripture: s.scripture || '',
      audioUrl: s.audioUrl || '',
      videoUrl: s.videoUrl || '',
      thumbnailUrl: s.thumbnailUrl || '',
      description: s.description || '',
      status: s.status || 'PUBLISHED',
      seriesId: s.seriesId || '',
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

      {/* ✅ Cloudinary image upload instead of URL input */}
      <ImageUpload
        label="Thumbnail Image"
        currentUrl={formData.thumbnailUrl}
        onUpload={(url) => setFormData({ ...formData, thumbnailUrl: url })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea rows={3} value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select value={formData.status || 'PUBLISHED'}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
    </>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Manage Sermons</h1>
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
          {showForm ? 'Cancel' : '+ New Sermon'}
        </button>

        {/* Create Form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
            <h2 className="text-lg font-bold text-blue-900 mb-2">New Sermon</h2>
            {renderFields(form, setForm)}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Sermon'}
            </button>
          </form>
        )}

        {/* Edit Form */}
        {editingId && (
          <form onSubmit={handleEdit} className="bg-white rounded-xl shadow p-6 mb-8 space-y-4 border-2 border-yellow-400">
            <h2 className="text-lg font-bold text-yellow-600 mb-2">✏️ Edit Sermon</h2>
            {renderFields(editForm, setEditForm)}
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
                {loading ? 'Saving...' : 'Update Sermon'}
              </button>
              <button type="button" onClick={() => setEditingId(null)}
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Sermons List */}
        <div className="space-y-4">
          {sermons.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No sermons yet.</p>
          ) : (
            sermons.map((s) => (
              <div key={s.id} className="bg-white rounded-xl shadow p-5 flex justify-between items-start">
                <div className="flex gap-4 items-start">
                  {/* ✅ Show thumbnail in list */}
                  {s.thumbnailUrl && (
                    <img src={s.thumbnailUrl} alt={s.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-bold text-blue-900">{s.title}</h3>
                    <p className="text-sm text-gray-500">{s.speaker} · {new Date(s.date).toDateString()}</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block ${
                      s.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                      s.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{s.status}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(s)}
                    className="text-yellow-500 hover:text-yellow-700 text-sm font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(s.id)}
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