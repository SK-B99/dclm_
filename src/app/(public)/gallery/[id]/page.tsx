import Link from "next/link";
import { getGalleryAlbums } from "@/lib/api";

async function getAlbum(id: string) {
  const albums = await getGalleryAlbums();
  return albums.find((a: any) => a.id === id) || null;
}

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let album: any = null;

  try {
    album = await getAlbum(id);
  } catch {
    album = null;
  }

  if (!album) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-xl">Album not found.</p>

        <Link
          href="/gallery"
          className="text-blue-900 font-medium mt-4 inline-block hover:underline"
        >
          ← Back to Gallery
        </Link>
      </div>
    );
  }

  const images =
    album.media?.filter((m: any) => m.type === "IMAGE") || [];

  const videos =
    album.media?.filter((m: any) => m.type === "VIDEO") || [];

  const others =
    album.media?.filter(
      (m: any) => m.type !== "IMAGE" && m.type !== "VIDEO"
    ) || [];

  const getEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);

      const videoId = u.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (u.hostname === "youtu.be") {
        return `https://www.youtube.com/embed${u.pathname}`;
      }
    } catch {}

    return url;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <Link
        href="/gallery"
        className="text-blue-900 text-sm font-medium hover:underline mb-6 inline-block"
      >
        ← Back to Gallery
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          {album.title}
        </h1>

        {album.description && (
          <p className="text-gray-500">{album.description}</p>
        )}

        <p className="text-sm text-gray-400 mt-1">
          {album.media?.length || 0} items
        </p>
      </div>

      {album.media?.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No media in this album yet.</p>
        </div>
      )}

      {/* Photos */}
      {images.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Photos
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((m: any) => (
              <a
                key={m.id}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl shadow hover:shadow-md transition hover:-translate-y-1"
              >
                <img
                  src={m.url}
                  alt={m.title || album.title}
                  className="w-full h-48 object-cover"
                />

                {m.title && (
                  <p className="text-xs text-gray-500 p-2 truncate">
                    {m.title}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Videos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((m: any) => (
              <div
                key={m.id}
                className="rounded-xl overflow-hidden shadow"
              >
                <div className="aspect-video">
                  <iframe
                    src={getEmbedUrl(m.url)}
                    title={m.title || "Video"}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>

                {m.title && (
                  <p className="text-sm text-gray-600 p-3">
                    {m.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Files */}
      {others.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Other Files
          </h2>

          <div className="space-y-3">
            {others.map((m: any) => (
              <a
                key={m.id}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-xl shadow p-4 hover:shadow-md transition"
              >
                <span className="text-2xl">
                  {m.type === "AUDIO" ? "🎵" : "📄"}
                </span>

                <div>
                  <p className="font-medium text-blue-900">
                    {m.title || "Untitled"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {m.type}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}