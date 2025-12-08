import { BookOpen, Feather, Sparkles } from "lucide-react";

export default function BlogHero() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-linear-to-br from-amber-900 via-orange-800 to-red-900">
      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-linear(circle at 2px 2px, rgba(255,255,255,0.7) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-30">
        <Sparkles className="w-16 h-16 text-amber-200 animate-pulse" />
      </div>

      <div className="absolute bottom-20 right-10 opacity-30">
        <Feather
          className="w-20 h-20 text-orange-200 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="absolute top-1/2 left-1/4 opacity-20">
        <BookOpen
          className="w-24 h-24 text-red-200 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6 max-w-5xl mx-auto">
        <div className="mb-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wider">
            STORIES & WISDOM
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-xl">
          Tales from the
          <span className="block text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-orange-300">
            Ancestral Path
          </span>
        </h1>

        <p className="text-xl md:text-2xl font-light max-w-3xl mb-8 leading-relaxed text-amber-50 drop-shadow">
          Journey through stories that bridge past and present — where culture
          breathes, traditions speak, and every word carries the weight of
          generations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#latest"
            className="bg-white text-orange-900 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-amber-100 transition-all transform hover:scale-105"
          >
            Read Latest Stories
          </a>
          <a
            href="#categories"
            className="bg-white/10 backdrop-blur-md text-white border border-white/30 font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition-all"
          >
            Browse Categories
          </a>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-stone-900 to-transparent" />

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}
