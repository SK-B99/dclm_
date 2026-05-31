import { getSermon } from "@/lib/api";
import Link from "next/link";

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ await params in Next.js 15

  let sermon: any = null;
  try {
    sermon = await getSermon(id);
  } catch {
    sermon = null;
  }

  if (!sermon) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-xl">Sermon not found.</p>
        <Link href="/sermons" className="text-blue-900 font-medium mt-4 inline-block hover:underline">
          ← Back to Sermons
        </Link>
      </div>
    );
  }

  // Convert YouTube watch URL to embed URL
  const getEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      const videoId = u.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed${u.pathname}`;
    } catch {}
    return url;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/sermons" className="text-blue-900 text-sm font-medium hover:underline mb-6 inline-block">
        ← Back to Sermons
      </Link>

      {/* Thumbnail only if no video */}
      {sermon.thumbnailUrl && !sermon.videoUrl && (
        <img
          src={sermon.thumbnailUrl}
          alt={sermon.title}
          className="w-full h-72 object-cover rounded-xl mb-6"
        />
      )}

      {/* Video Embed */}
      {sermon.videoUrl && (
        <div className="w-full aspect-video rounded-xl overflow-hidden mb-6">
          <iframe
            src={getEmbedUrl(sermon.videoUrl)}
            title={sermon.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {/* Details */}
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">{sermon.title}</h1>
        <p className="text-yellow-600 font-medium mb-1">{sermon.speaker}</p>
        <p className="text-sm text-gray-400 mb-4">{new Date(sermon.date).toDateString()}</p>

        {sermon.scripture && (
          <div className="bg-blue-50 border-l-4 border-blue-900 px-4 py-3 rounded mb-4">
            <p className="text-sm text-blue-900 font-medium">📖 {sermon.scripture}</p>
          </div>
        )}

        {sermon.description && (
          <p className="text-gray-600 leading-relaxed mb-6">{sermon.description}</p>
        )}

        {/* Audio Player */}
        {sermon.audioUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">🎵 Listen to Audio</p>
            <audio controls className="w-full">
              <source src={sermon.audioUrl} />
              Your browser does not support audio playback.
            </audio>
          </div>
        )}

        {/* Tags */}
        {sermon.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {sermon.tags.map((t: any) => (
              <span key={t.tagId} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {t.tag?.name}
              </span>
            ))}
          </div>
        )}

        {/* Series */}
        {sermon.series && (
          <div className="mt-4 text-sm text-gray-500">
            Part of series: <span className="font-medium text-blue-900">{sermon.series.title}</span>
          </div>
        )}
      </div>
    </div>
  );
}