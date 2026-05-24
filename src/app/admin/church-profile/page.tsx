'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminGetChurchProfile, adminUpdateChurchProfile } from '@/lib/admin/church-profile.api';

export default function AdminChurchProfilePage() {
  const { token, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) router.push('/admin');
    else fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const data = await adminGetChurchProfile(token!);
      setForm(data);
    } catch {} finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await adminUpdateChurchProfile(token!, form);
      setMessage('Church profile updated successfully!');
    } catch {
      setMessage('Failed to update church profile.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: string, type = 'text') => (
    <div key={key}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key] || ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  );

  if (!isAuthenticated) return null;

  if (fetching) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Church Profile</h1>
        <button onClick={() => router.push('/admin/dashboard')}
          className="text-sm bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
          ← Dashboard
        </button>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {message && (
          <div className={`px-4 py-3 rounded-lg mb-6 text-sm ${
            message.includes('successfully')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900 mb-2">Basic Info</h2>
          {field('Church Name *', 'name')}
          {field('Tagline', 'tagline')}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          {field('Email', 'email', 'email')}
          {field('Phone', 'phone')}
          {field('Address', 'address')}
          {field('City', 'city')}
          {field('Country', 'country')}
          {field('Logo URL', 'logoUrl', 'url')}
          {field('Banner URL', 'bannerUrl', 'url')}

          <h2 className="text-lg font-bold text-blue-900 pt-4">Social Media</h2>
          {field('Facebook', 'facebook', 'url')}
          {field('Instagram', 'instagram', 'url')}
          {field('YouTube', 'youtube', 'url')}
          {field('Twitter', 'twitter', 'url')}
          {field('WhatsApp', 'whatsapp')}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}