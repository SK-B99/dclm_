import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="bg-blue-900 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to DCLM Church
        </h1>
        <p className="text-lg md:text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
          Winning the world for Jesus Christ. Join us every Sunday for worship,
          fellowship and the Word of God.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/sermons"
            className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition"
          >
            Watch Sermons
          </Link>
          <Link
            href="/events"
            className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-blue-900 transition"
          >
            Upcoming Events
          </Link>
        </div>
      </section>
      <section className="py-16 px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-blue-900">
          Service Times
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { day: "Sunday", time: "9:00 AM", label: "Main Service" },
            { day: "Wednesday", time: "6:00 PM", label: "Bible Study" },
            { day: "Friday", time: "6:00 PM", label: "Prayer Meeting" },
          ].map((s) => (
            <div
              key={s.day}
              className="bg-white rounded-xl shadow p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-blue-900">{s.day}</h3>
              <p className="text-yellow-500 font-semibold text-lg">{s.time}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { href: "/sermons", label: "Sermons", desc: "Listen to messages" },
            { href: "/events", label: "Events", desc: "Upcoming programs" },
            {
              href: "/announcements",
              label: "Announcements",
              desc: "Latest news",
            },
            { href: "/gallery", label: "Gallery", desc: "Photos and videos" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl shadow p-6 text-center hover:shadow-md transition hover:-translate-y-1"
            >
              <h3 className="text-lg font-bold text-blue-900">{item.label}</h3>
              <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
