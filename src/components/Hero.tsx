import { useState, useEffect } from "react";

const slides = [
  {
    image: "../../public/asset/bg.jpg",
    text: "Where every step echoes the rhythm of ancient footsteps.",
  },
  {
    image: "../../public/asset/facesofken.jpg",
    text: "We remember in firelight — stories passed from soul to sky.",
  },
  {
    image: "../../public/asset/elephant.jpg",
    text: "Symbols of old. Voices of today. Wisdom in every stitch.",
  },
  {
    image: "../../public/asset/tribeJumping.jpg",
    text: "In each hand lies the medicine of memory.",
  },
  {
    image: "../../public/asset/sessionbg.jpg",
    text: "Through dance, we carry the pulse of our ancestors.",
  },
  {
    image: "../../src/assets/web.jpg",
    text: "Through dance, we carry the pulse of our ancestors.",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] md:h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${slides[index].image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50 md:bg-black/60" />{" "}
        {/* Overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-2xl tracking-wide">
          SankofaSeek
        </h1>
        <p className="text-2xl md:text-3xl font-semibold max-w-3xl mb-6 drop-shadow-lg">
          {slides[index].text}
        </p>
        <a
          href="/marketplace"
          className="mt-4 bg-accent text-white font-bold px-8 py-4 rounded-lg hover:bg-secondary transition text-lg"
        >
          Explore Stories
        </a>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 flex justify-center w-full space-x-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition ${
              i === index ? "bg-accent" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
