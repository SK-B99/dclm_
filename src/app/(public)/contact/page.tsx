export const dynamic = 'force-dynamic';

import { getChurchProfile } from '@/lib/api';
import ContactForm from '@/components/ContactForm';

export default async function ContactPage() {
  let profile: any = null;
  try {
    profile = await getChurchProfile();
  } catch {
    profile = null;
  }

  let serviceTimes: { day: string; time: string; label: string }[] = [];
  if (profile?.serviceTimes) {
    try {
      serviceTimes = JSON.parse(profile.serviceTimes);
    } catch {
      serviceTimes = [];
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-8 space-y-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Get In Touch
          </h2>
          {profile?.address && (
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-gray-700 font-medium">
                {profile.address}{profile.city ? `, ${profile.city}` : ''}{profile.country ? `, ${profile.country}` : ''}
              </p>
            </div>
          )}
          {profile?.phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-700 font-medium">{profile.phone}</p>
            </div>
          )}
          {profile?.email && (
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-700 font-medium">{profile.email}</p>
            </div>
          )}
          {profile?.whatsapp && (
            <div>
              <p className="text-sm text-gray-500">WhatsApp</p>
              <p className="text-gray-700 font-medium">{profile.whatsapp}</p>
            </div>
          )}
          {serviceTimes.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Service Times</p>
              {serviceTimes.map((s, i) => (
                <p key={i} className="text-gray-700 font-medium">
                  {s.day} {s.time} — {s.label}
                </p>
              ))}
            </div>
          )}
          {(profile?.facebook || profile?.instagram || profile?.youtube || profile?.twitter) && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Follow Us</p>
              <div className="flex gap-3 flex-wrap">
                {profile?.facebook && (
                  <a href={profile.facebook} target="_blank" rel="noopener noreferrer"
                    className="text-blue-700 text-sm font-medium hover:underline">Facebook</a>
                )}
                {profile?.instagram && (
                  <a href={profile.instagram} target="_blank" rel="noopener noreferrer"
                    className="text-pink-600 text-sm font-medium hover:underline">Instagram</a>
                )}
                {profile?.youtube && (
                  <a href={profile.youtube} target="_blank" rel="noopener noreferrer"
                    className="text-red-600 text-sm font-medium hover:underline">YouTube</a>
                )}
                {profile?.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
                    className="text-sky-500 text-sm font-medium hover:underline">Twitter</a>
                )}
              </div>
            </div>
          )}
          {!profile && (
            <>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-700 font-medium">Accra, Ghana</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-700 font-medium">+233 20 123 4567</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-700 font-medium">info@dclm.org</p>
              </div>
            </>
          )}
        </div>

        {/* ✅ ContactForm replaces the old static form */}
        <ContactForm whatsapp={profile?.whatsapp} />
      </div>
    </div>
  );
}