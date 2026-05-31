import { getChurchProfile } from '@/lib/api';

export default async function Footer() {
  let profile: any = null;
  try {
    profile = await getChurchProfile();
  } catch {
    profile = null;
  }

  return (
    <footer className="bg-blue-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2">
            {profile?.name || 'DCLM Church'}
          </h3>
          <p className="text-sm text-blue-200">
            {profile?.tagline || 'Winning the world for Jesus Christ.'}
          </p>
          {/* ✅ Description added */}
          {profile?.description && (
            <p className="text-sm text-blue-300 mt-1">
              {profile.description}
            </p>
          )}
          {/* Social Media */}
          {(profile?.facebook || profile?.instagram || profile?.youtube || profile?.twitter) && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {profile?.facebook && (
                <a href={profile.facebook} target="_blank" rel="noopener noreferrer"
                  className="text-blue-300 hover:text-yellow-400 text-xs transition">
                  Facebook
                </a>
              )}
              {profile?.instagram && (
                <a href={profile.instagram} target="_blank" rel="noopener noreferrer"
                  className="text-blue-300 hover:text-yellow-400 text-xs transition">
                  Instagram
                </a>
              )}
              {profile?.youtube && (
                <a href={profile.youtube} target="_blank" rel="noopener noreferrer"
                  className="text-blue-300 hover:text-yellow-400 text-xs transition">
                  YouTube
                </a>
              )}
              {profile?.twitter && (
                <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
                  className="text-blue-300 hover:text-yellow-400 text-xs transition">
                  Twitter
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Quick Links</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li><a href="/sermons" className="hover:text-yellow-400">Sermons</a></li>
            <li><a href="/events" className="hover:text-yellow-400">Events</a></li>
            <li><a href="/announcements" className="hover:text-yellow-400">Announcements</a></li>
            <li><a href="/gallery" className="hover:text-yellow-400">Gallery</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Contact</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            {profile?.address ? (
              <li>{profile.address}{profile.city ? `, ${profile.city}` : ''}</li>
            ) : (
              <li>Accra, Ghana</li>
            )}
            {profile?.phone ? (
              <li>{profile.phone}</li>
            ) : (
              <li>+233 20 123 4567</li>
            )}
            {profile?.email ? (
              <li>{profile.email}</li>
            ) : (
              <li>info@dclm.org</li>
            )}
            {profile?.whatsapp && <li>WhatsApp: {profile.whatsapp}</li>}
          </ul>
        </div>
      </div>

      <div className="text-center text-blue-300 text-xs py-4 border-t border-blue-800">
        © {new Date().getFullYear()} {profile?.name || 'DCLM Church'}. All rights reserved.
      </div>
    </footer>
  );
}