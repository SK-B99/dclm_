export const dynamic = "force-dynamic";

import { getAnnouncements } from "@/lib/api";

export default async function AnnouncementsPage() {
  let announcements = [];
  try {
    announcements = await getAnnouncements();
  } catch {
    announcements = [];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-blue-900 mb-2">Announcements</h1>
      <p className="text-gray-500 mb-10">Latest news and updates</p>
      {announcements.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No announcements available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">{item.body}</p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(item.createdAt).toDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
