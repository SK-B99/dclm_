'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  adminGetAlbums, adminCreateAlbum, adminUpdateAlbum,
  adminDeleteAlbum, adminCreateMedia, adminDeleteMedia,
} from '@/lib/admin/gallery.api';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminGalleryPage() {
  const { token, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [albums, setAlbums] = useState<any[]>([]);
  const [albumForm, setAlbumForm] = useState({ title: '', description: '', coverUrl: '' });
  const [mediaForm, setMediaForm] = useState({ url: '', type: 'IMAGE', title: '', albumId: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [editAlbumForm, setEditAlbumForm] = useState({ title: '', description: '', coverUrl: '' });

  useEffect(() => {
    if (!isAuthenticated) router.push('/admin');
    else fetchAlbums();
  }, [isAuthenticated]);

  const fetchAlbums = async () => {
    try {
      const data = await adminGetAlbums(token!);
      setAlbums(data);
    } catch {}
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminCreateAlbum(token!, {
        ...albumForm,
        description: albumForm.description || undefined,
        coverUrl: albumForm.coverUrl || undefined,
      });
      setMessage('Album created!');
      setAlbumForm({ title: '', description: '', coverUrl: '' });
      setShowAlbumForm(false);
      fetchAlbums();
    } catch {
      setMessage('Failed to create album.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminUpdateAlbum(token!, editingAlbumId!, {
        ...editAlbumForm,
        description: editAlbumForm.description || undefined,
        coverUrl: editAlbumForm.coverUrl || undefined,
      });
      setMessage('Album updated!');
      setEditingAlbumId(null);
      setEditAlbumForm({ title: '', description: '', coverUrl: '' });
      fetchAlbums();
    } catch {
      setMessage('Failed to update album.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminCreateMedia(token!, {
        ...mediaForm,
        title: mediaForm.title || undefined,
        albumId: mediaForm.albumId || undefined,
      });
      setMessage('Media added!');
      setMediaForm({ url: '', type: 'IMAGE', title: '', albumId: '' });
      setShowMediaForm(false);
      fetchAlbums();
    } catch {
      setMessage('Failed to add media.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Bulk upload handler
  const handleBulkUpload = async (urls: string[]) => {
    setLoading(true);
    setMessage('');
    try {
      for (const url of urls) {
        await adminCreateMedia(token!, {
          url,
          type: 'IMAGE',
          title: '',
          albumId: mediaForm.albumId || undefined,
        });
      }
      setMessage(`${urls.length} photo${urls.length > 1 ? 's' : ''} uploaded successfully!`);
      setShowMediaForm(false);
      fetchAlbums();
    } catch {
      setMessage('Some photos failed to upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm('Delete this album and all its media?')) return;
    try {
      await adminDeleteAlbum(token!, id);
      fetchAlbums();
    } catch {}
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Delete this media item?')) return;
    try {
      await adminDeleteMedia(token!, id);
      fetchAlbums();
    } catch {}
  };

  const startEditAlbum = (album: any) => {
    setEditingAlbumId(album.id);
    setEditAlbumForm({
      title: album.title || '',
      description: album.description || '',
      coverUrl: album.coverUrl || '',
    });
    setShowAlbumForm(false);
    setShowMediaForm(false);
  };

  const albumFields = (formData: any, setFormData: any) => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input type="text" required value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input type="text" value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <ImageUpload
        label="Album Cover Image"
        currentUrl={formData.coverUrl}
        onUpload={(url) => setFormData({ ...formData, coverUrl: url })}
      />
    </>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Manage Gallery</h1>
        <button onClick={() => router.push('/admin/dashboard')}
          className="text-sm bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
          ← Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div className={`px-4 py-3 rounded-lg mb-6 text-sm ${
            message.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button onClick={() => { setShowAlbumForm(!showAlbumForm); setShowMediaForm(false); setEditingAlbumId(null); }}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition text-sm font-bold">
            {showAlbumForm ? 'Cancel' : '+ New Album'}
          </button>
          <button onClick={() => { setShowMediaForm(!showMediaForm); setShowAlbumForm(false); setEditingAlbumId(null); }}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-400 transition text-sm font-bold">
            {showMediaForm ? 'Cancel' : '+ Add Media'}
          </button>
        </div>

        {/* Create Album Form */}
        {showAlbumForm && (
          <form onSubmit={handleCreateAlbum} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
            <h2 className="text-lg font-bold text-blue-900">New Album</h2>
            {albumFields(albumForm, setAlbumForm)}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Create Album'}
            </button>
          </form>
        )}

        {/* Edit Album Form */}
        {editingAlbumId && (
          <form onSubmit={handleEditAlbum} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4 border-2 border-yellow-400">
            <h2 className="text-lg font-bold text-yellow-600">✏️ Edit Album</h2>
            {albumFields(editAlbumForm, setEditAlbumForm)}
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
                {loading ? 'Saving...' : 'Update Album'}
              </button>
              <button type="button" onClick={() => setEditingAlbumId(null)}
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Add Media Form */}
        {showMediaForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
            <h2 className="text-lg font-bold text-blue-900">Add Media</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={mediaForm.type}
                onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value, url: '' })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="AUDIO">Audio</option>
                <option value="DOCUMENT">Document</option>
              </select>
            </div>

            {/* Album selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Album</label>
              <select value={mediaForm.albumId}
                onChange={(e) => setMediaForm({ ...mediaForm, albumId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="">No Album</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>

            {/* ✅ Bulk image upload for IMAGE, URL input for others */}
            {mediaForm.type === 'IMAGE' ? (
              <div className="space-y-2">
                <ImageUpload
                  label="Upload Photos (select multiple at once)"
                  multiple={true}
                  onUpload={(url) => setMediaForm({ ...mediaForm, url })}
                  onMultiUpload={handleBulkUpload}
                />
                <p className="text-xs text-gray-400">
                  💡 Hold Ctrl (Windows) or Cmd (Mac) to select multiple photos at once
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddMedia} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {mediaForm.type === 'VIDEO' ? 'YouTube/Video URL *' :
                     mediaForm.type === 'AUDIO' ? 'Audio URL *' : 'Document URL *'}
                  </label>
                  <input type="url" required value={mediaForm.url}
                    onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                    placeholder={
                      mediaForm.type === 'VIDEO' ? 'https://youtube.com/watch?v=...' :
                      mediaForm.type === 'AUDIO' ? 'https://cloudinary.com/audio.mp3' :
                      'https://example.com/document.pdf'
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={mediaForm.title}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
                  {loading ? 'Saving...' : 'Add Media'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Albums List */}
        <div className="space-y-6">
          {albums.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No albums yet.</p>
          ) : (
            albums.map((album) => (
              <div key={album.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-start">
                    {album.coverUrl && (
                      <img src={album.coverUrl} alt={album.title}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-bold text-blue-900">{album.title}</h3>
                      {album.description && (
                        <p className="text-sm text-gray-500">{album.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{album.media?.length || 0} items</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => startEditAlbum(album)}
                      className="text-yellow-500 hover:text-yellow-700 text-sm font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteAlbum(album.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
                {album.media?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {album.media.map((m: any) => (
                      <div key={m.id} className="bg-gray-50 rounded-lg p-3">
                        {m.type === 'IMAGE' && m.url && (
                          <img src={m.url} alt={m.title || ''}
                            className="w-full h-24 object-cover rounded mb-2" />
                        )}
                        {m.type === 'VIDEO' && (
                          <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                            <span className="text-2xl">▶️</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-600 truncate">{m.title || m.url}</p>
                        <p className="text-xs text-gray-400">{m.type}</p>
                        <button onClick={() => handleDeleteMedia(m.id)}
                          className="text-red-400 hover:text-red-600 text-xs mt-1">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}