export default function About() {
  const teamMembers = [
    {
      name: "Amina Adom",
      role: "Founder",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      quote: "The past holds the keys to our future",
    },
  ];

  return (
    <section className="relative bg-linear-to-br from-amber-50 via-stone-50 to-amber-50/40 py-20">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-amber-600 via-amber-500 to-amber-600"></div>

      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-amber-600 text-amber-50 text-sm font-semibold rounded-full tracking-wider shadow-lg">
              OUR STORY
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-6">
            About SankofaSeek
          </h1>

          <div className="w-32 h-1.5 bg-linear-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8 rounded-full"></div>

          {/* Decorative Sankofa Symbol */}
          <div className="flex justify-center mb-8">
            <svg
              className="w-16 h-16 text-amber-700"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-stone-50 border-l-4 border-amber-600 rounded-r-2xl shadow-xl p-8 md:p-10 relative overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full opacity-30"></div>

            <div className="relative z-10">
              <svg
                className="w-12 h-12 text-amber-600 mb-4 opacity-50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
              </svg>

              <p className="text-lg md:text-xl leading-relaxed text-stone-700 font-light mb-6 italic">
                Long ago, before clocks ruled time, humanity walked in spirals —
                not straight lines.
                <span className="block mt-4 not-italic font-normal text-stone-800">
                  SankofaSeek is a movement to rediscover the treasures hidden
                  in the past and carry them forward as tools for healing,
                  creativity, and innovation.
                </span>
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-0.5 bg-amber-600 rounded-full"></div>
                <p className="text-base text-stone-600 font-medium">
                  We believe remembering is an act of courage, not nostalgia.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">
            Meet Our Team
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Passionate guardians of heritage, united in preserving and sharing
            the wisdom of our ancestors
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="group bg-stone-50 shadow-lg border-2 border-stone-300/60 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-linear-to-br from-amber-100 to-stone-200">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-900/70 via-stone-900/20 to-transparent"></div>

                {/* Decorative Corner */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 bg-amber-600 opacity-90"
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                ></div>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-stone-800 mb-1 group-hover:text-amber-700 transition-colors duration-300">
                  {member.name}
                </h3>

                <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full mb-4 border border-amber-300">
                  {member.role}
                </div>

                <div className="border-t-2 border-stone-200 pt-4 mt-2">
                  <p className="text-sm text-stone-600 italic leading-relaxed">
                    "{member.quote}"
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-3 mt-5">
                  <button className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all duration-300 group/btn">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </button>
                  <button className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all duration-300">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-linear-to-r from-amber-600 to-amber-700 rounded-2xl shadow-2xl p-8 md:p-12 max-w-3xl">
            <h3 className="text-2xl md:text-3xl font-bold text-amber-50 mb-4">
              Join Our Journey
            </h3>
            <p className="text-amber-100 mb-6 text-lg">
              Be part of a community dedicated to preserving and celebrating
              cultural heritage
            </p>
            <button className="px-8 py-3 bg-stone-50 text-amber-700 font-semibold rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              Get Involved
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
