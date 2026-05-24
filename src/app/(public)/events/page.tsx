export const dynamic = "force-dynamic";

import { getEvents } from "@/lib/api";

export default async function EventsPage() {
  let events = [];
  try {
    events = await getEvents();
  } catch {
    events = [];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-blue-900 mb-2">Events</h1>
      <p className="text-gray-500 mb-10">Upcoming programs and activities</p>
      {events.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No events available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <div key={event.id} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-blue-900 mb-1">
                {event.title}
              </h2>
              {event.location && (
                <p className="text-sm text-gray-500 mb-1">{event.location}</p>
              )}
              <p className="text-sm text-yellow-600 font-medium">
                {new Date(event.startDate).toDateString()}
              </p>
              {event.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
