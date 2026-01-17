import {
  Heart,
  Compass,
  Users,
  Sparkles,
  BookOpen,
  Target,
  Globe,
} from "lucide-react";
import { SubscribeModal } from "../components/SubscribeModal";
import { useState } from "react";
export default function About() {
  const [open, setOpen] = useState(false);
  const values = [
    {
      icon: Heart,
      title: "Cultural Preservation",
      description:
        "We honor the wisdom of our ancestors by preserving their stories, traditions, and knowledge for future generations.",
    },
    {
      icon: Compass,
      title: "Guided Discovery",
      description:
        "Every journey back is a journey forward. We guide seekers to rediscover their roots and reshape their future.",
    },
    {
      icon: Users,
      title: "Community Connection",
      description:
        "Building bridges between generations, cultures, and continents through shared heritage and collective memory.",
    },
    {
      icon: Sparkles,
      title: "Innovation through Tradition",
      description:
        "Ancient wisdom meets modern thinking. We decode ancestral knowledge as technology for contemporary challenges.",
    },
  ];

  const milestones = [
    {
      year: "The Vision",
      title: "Seeds of Sankofa",
      description:
        "Born from a deep calling to bridge the gap between ancestral wisdom and modern consciousness.",
    },
    {
      year: "The Foundation",
      title: "Building the Platform",
      description:
        "Creating digital spaces where stories, symbols, and heritage could be preserved and shared globally.",
    },
    {
      year: "The Community",
      title: "Growing Together",
      description:
        "Connecting seekers, storytellers, and culture bearers from across the African diaspora and beyond.",
    },
    {
      year: "The Future",
      title: "Expanding Horizons",
      description:
        "Developing new ways to experience heritage through immersive storytelling and cultural innovation.",
    },
  ];

  return (
    <section className="relative bg-linear-to-br from-amber-50 via-stone-50 to-orange-50/30">
      {/* Top Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-amber-600 via-orange-500 to-amber-600"></div>

      <div className="container mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-linear-to-r from-amber-600 to-orange-600 text-white text-sm font-semibold rounded-full tracking-wider shadow-lg">
              OUR STORY
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold text-stone-900 mb-6 tracking-tight">
            About SankofaSeek
          </h1>

          <div className="w-32 h-1.5 bg-linear-to-r from-transparent via-amber-600 to-transparent mx-auto mb-8 rounded-full"></div>

          {/* Decorative Sankofa Symbol */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-linear-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>

          <p className="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            A movement to rediscover ancestral treasures and carry them forward
            as tools for healing, creativity, and transformation.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="bg-white border-l-8 border-amber-600 rounded-2xl shadow-2xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-bl from-amber-100 to-transparent rounded-bl-full opacity-40"></div>

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Target className="w-6 h-6 text-amber-700" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                  Our Mission
                </h2>
              </div>

              <p className="text-lg md:text-xl leading-relaxed text-stone-700 mb-6 italic font-light">
                "Long ago, before clocks ruled time, humanity walked in spirals
                — not straight lines."
              </p>

              <div className="space-y-4 text-stone-700 text-lg leading-relaxed">
                <p>
                  SankofaSeek exists at the intersection of memory and
                  possibility. We are building a bridge between the ancient and
                  the emerging, where ancestral intelligence becomes a compass
                  for navigating the future.
                </p>

                <p className="font-medium text-stone-900">
                  We believe remembering is an act of courage, not nostalgia.
                  Every story recovered is a key turned. Every symbol decoded is
                  a door opened. Every tradition honored is a path illuminated.
                </p>

                <p>
                  Through our platform, we create spaces for cultural
                  preservation, creative exploration, and conscious connection —
                  empowering individuals to understand where they come from so
                  they can shape where they're going.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-600">
                <Sparkles className="w-6 h-6 text-amber-700 shrink-0" />
                <p className="text-stone-800 font-medium">
                  We honor the old while architecting the new — because legacy
                  is not a relic, it's a resource.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-stone-200 hover:border-amber-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-linear-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-amber-700" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Journey Timeline */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              From vision to reality, one intentional step at a time
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-linear-to-b from-amber-600 via-orange-500 to-amber-600 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative pl-0 md:pl-20">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-0 w-16 h-16 bg-linear-to-br from-amber-600 to-orange-600 rounded-full  items-center justify-center text-white font-bold shadow-xl hidden md:flex">
                    {index + 1}
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-4 py-1 bg-amber-100 text-amber-800 text-sm font-semibold rounded-full">
                        {milestone.year}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="bg-linear-to-br from-amber-900 via-orange-900 to-stone-900 text-white rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20">
                  <Globe className="w-8 h-8 text-amber-300" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Meet the Founder
                </h2>
              </div>

              <h3 className="text-3xl font-bold text-amber-300 mb-4">
                Adetunji Adeyemi I
              </h3>

              <p className="text-2xl italic text-amber-100 mb-8 font-light">
                "My work exists at the intersection of memory and possibility."
              </p>

              <div className="space-y-6 text-lg leading-relaxed text-stone-100">
                <p>
                  I am building SankofaSeek as a living compass — a place where
                  ancestral intelligence, cultural design, and future systems
                  thinking converge. I believe humanity advances not by
                  abandoning its origins, but by decoding them.
                </p>

                <p className="text-amber-100">
                  Every forgotten story is an algorithm. Every symbol is an
                  instruction. Every lineage is a technology the world has yet
                  to fully understand.
                </p>

                <p>
                  Through storytelling, visual cosmology, and heritage
                  innovation, I create bridges between worlds — between past and
                  future, identity and imagination, what we inherited and what
                  we must build next.
                </p>

                <p>
                  My background spans cultural anthropology, design thinking,
                  and digital innovation. But my deepest education came from
                  listening — to elders, to stories, to the quiet wisdom
                  embedded in traditions that have survived centuries of
                  disruption.
                </p>

                <p className="text-amber-100">
                  My mission is simple but vast: to guide a global renaissance
                  of African memory, creativity, and consciousness — one
                  narrative, one symbol, one awakened seeker at a time.
                </p>

                <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <p className="font-bold text-xl text-amber-300 mb-2">
                    My Philosophy
                  </p>
                  <p className="font-medium">
                    I work in spirals, not lines. I build systems, not moments.
                    I honor the old while architecting the new.
                  </p>
                  <p className="mt-4 text-amber-200">
                    Legacy is my curriculum. Future is my material. Sankofa is
                    my methodology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Resources and experiences designed to reconnect you with your
              heritage
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">
                Stories & Articles
              </h3>
              <p className="text-stone-600">
                Deep dives into cultural traditions, historical narratives, and
                contemporary interpretations of ancestral wisdom.
              </p>
            </div>

            <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">
                Cultural Artifacts
              </h3>
              <p className="text-stone-600">
                Explore symbols, patterns, and designs that carry centuries of
                meaning and continue to inspire today.
              </p>
            </div>

            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 hover:shadow-xl">
              <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">
                Community Space
              </h3>
              <p className="text-stone-600">
                Connect with fellow seekers, share discoveries, and participate
                in collective remembering and learning.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-block bg-linear-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl shadow-2xl p-10 md:p-14 max-w-4xl">
            <Heart className="w-16 h-16 text-amber-100 mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Journey
            </h3>
            <p className="text-amber-50 mb-8 text-xl leading-relaxed max-w-2xl mx-auto">
              Be part of a global community dedicated to preserving heritage,
              celebrating culture, and building bridges between past and future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-amber-700 font-bold rounded-full hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg">
                Start Exploring
              </button>
              <button  onClick={() => setOpen(true)} className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-all duration-300 border-2 border-white/30 text-lg">
                Connect With Us
              </button>
              

<SubscribeModal
  open={open}
  onClose={() => setOpen(false)}
  endpoint="https://sanfossa-backend.onrender.com/api/subscribers/subscribe"
  brandColor="emerald"
  onSuccess={() => {
    // toast.success("Subscribed!");
  }}
/>


            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
