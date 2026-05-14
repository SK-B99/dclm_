export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2">DCLM Church</h3>
          <p className="text-sm text-blue-200">
            Winning the world for Jesus Christ.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Quick Links</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>
              <a href="/sermons" className="hover:text-yellow-400">
                Sermons
              </a>
            </li>
            <li>
              <a href="/events" className="hover:text-yellow-400">
                Events
              </a>
            </li>
            <li>
              <a href="/announcements" className="hover:text-yellow-400">
                Announcements
              </a>
            </li>
            <li>
              <a href="/gallery" className="hover:text-yellow-400">
                Gallery
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">Contact</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>Accra, Ghana</li>
            <li>+233 20 123 4567</li>
            <li>info@dclm.org</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-blue-300 text-xs py-4 border-t border-blue-800">
        © {new Date().getFullYear()} DCLM Church. All rights reserved.
      </div>
    </footer>
  );
}
