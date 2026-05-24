import { AdminAuthProvider } from '@/context/AdminAuthContext';

export const metadata = { title: 'DCLM Admin' };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-100">{children}</div>
    </AdminAuthProvider>
  );
}