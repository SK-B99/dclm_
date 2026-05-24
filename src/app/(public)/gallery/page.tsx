export const dynamic = "force-dynamic";

import { getGalleryAlbums } from "@/lib/api";

export default async function GalleryPage() {
  let albums = [];
  try {
    albums = await getGalleryAlbums();
  } catch {
    albums = [];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-blue-900 mb-2">Gallery</h1>
      <p className="text-gray-500 mb-10">Photos and videos from our services</p>
      {albums.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No media available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album: any) => (
            <div
              key={album.id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <div className="w-full h-48 bg-blue-900 flex items-center justify-center">
                <span className="text-5xl">🖼</span>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-blue-900">
                  {album.title}
                </h2>
                {album.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {album.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {album.media?.length || 0} items
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
