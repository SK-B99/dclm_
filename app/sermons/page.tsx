import Link from "next/link";
import { getSermons } from "@/lib/api";

export default async function SermonsPage() {
  let sermons = [];
  try {
    sermons = await getSermons();
  } catch {
    sermons = [];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-blue-900 mb-2">Sermons</h1>
      <p className="text-gray-500 mb-10">Listen to messages from our pastors</p>
      {sermons.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No sermons available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon: any) => (
            <Link
              key={sermon.id}
              href={`/sermons/${sermon.id}`}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              <div className="w-full h-48 bg-blue-900 flex items-center justify-center">
                <span className="text-5xl">🎙</span>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-blue-900 mb-1">
                  {sermon.title}
                </h2>
                <p className="text-sm text-yellow-600 font-medium mb-1">
                  {sermon.speaker}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(sermon.date).toDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
