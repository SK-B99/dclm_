
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';

const sections = [
  { href: '/admin/sermons', label: 'Sermons', emoji: '🎙️', desc: 'Manage sermon posts' },
  { href: '/admin/events', label: 'Events', emoji: '📅', desc: 'Manage upcoming events' },
  { href: '/admin/announcements', label: 'Announcements', emoji: '📢', desc: 'Manage announcements' },
  { href: '/admin/gallery', label: 'Gallery', emoji: '🖼️', desc: 'Manage albums & media' },
  { href: '/admin/church-profile', label: 'Church Profile', emoji: '⛪', desc: 'Edit church info' },
];

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/admin');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">DCLM Admin Dashboard</h1>
        <button
          onClick={() => { logout(); router.push('/admin'); }}
          className="text-sm bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-gray-500 mb-8 text-sm">Select a section to manage content</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-white rounded-xl shadow p-6 hover:shadow-md transition hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-4xl mb-3">{s.emoji}</div>
              <h2 className="text-lg font-bold text-blue-900">{s.label}</h2>
              <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
