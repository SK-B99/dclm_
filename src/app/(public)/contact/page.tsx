export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-8 space-y-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Get In Touch
          </h2>
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
          <div>
            <p className="text-sm text-gray-500">Service Times</p>
            <p className="text-gray-700 font-medium">Sunday 9:00 AM</p>
            <p className="text-gray-700 font-medium">Wednesday 6:00 PM</p>
            <p className="text-gray-700 font-medium">Friday 6:00 PM</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Send a Message
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
            <button className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
