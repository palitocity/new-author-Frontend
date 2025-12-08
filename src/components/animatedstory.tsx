import { useEffect, useState } from "react";
import bgImage from "../assets/westafrica.jpg";

const textLines = [
  "Long ago, before clocks ruled time, humanity walked in spirals, not straight line.",
  "We knew that to move ahead, we must sometimes return.",
  "We carried our past like fire in a clay pot, protecting it against winds, so the flame could light tomorrow.",
  "From the forgetting, a seeker was born.",
  "SankofaSeek is the compass in a restless world.",
  "It points backward so humanity can move forward.",
  "Seek what was lost. Carry it forward.",
];

export default function StoryAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % textLines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Custom text color variable (change here if needed)
  const textColor = "#8B5A2B"; // Try "#8B5A2B" if you want a brighter tone

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[70vh] text-center font-body overflow-hidden px-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Slightly dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        <h2
          className="text-3xl md:text-5xl font-heading mb-6 drop-shadow-md font-bold"
          style={{ color: textColor }}
        >
          The Fire We Carried: Remembering to Move Forward
        </h2>

        <div
          key={index}
          className="text-lg md:text-2xl font-semibold leading-relaxed animate-fade-in-out"
          style={{ color: textColor }}
        >
          {textLines[index]}
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        .animate-fade-in-out {
          animation: fadeInOut 4s ease-in-out;
        }
      `}</style>
    </section>
  );
}
