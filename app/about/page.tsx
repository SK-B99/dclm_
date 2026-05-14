export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">About Us</h1>
      <div className="bg-white rounded-xl shadow p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            Deeper Christian Life Ministry (DCLM) is a Christian ministry
            committed to winning the world for Jesus Christ through the
            preaching of the Word of God.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To win souls for Christ and build disciples who will impact their
            world for God.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Preaching the undiluted Word of God and raising disciples who are
            committed to holiness and the Great Commission.
          </p>
        </div>
      </div>
    </div>
  );
}
