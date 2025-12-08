import icon from "../assets/icon.png";
import drum from "../assets/drum.png";
import map from "../assets/Saruni Basecamp - Luxury Safari Camps & Lodges in Kenya_files/547143411_1384821923652050_6945800033925993482_n.jpg";
import pot from "../assets/pot.png";
import adinka from "../assets/Saruni Basecamp - Luxury Safari Camps & Lodges in Kenya_files/548203159_1388697433264499_7377279747273691692_n.jpg";

export default function CultureBody() {
  return (
    <section className="relative bg-linear-to-b from-[#6B4321] via-[#8A5B38] to-[#D4AF36] text-light py-24 overflow-hidden">
      {/* Background scattered icons */}
      <img
        src={icon}
        alt="mask"
        className="absolute top-10 left-8 w-16 opacity-30 rotate-6 animate-pulse"
      />
      <img
        src={drum}
        alt="drum"
        className="absolute bottom-20 right-16 w-20 opacity-30 -rotate-12 animate-float"
      />
      <img
        src={map}
        alt="map"
        className="absolute top-1/2 left-1/3 w-24 opacity-20 hidden md:block"
      />
      <img
        src={pot}
        alt="pot"
        className="absolute bottom-10 left-10 w-16 opacity-25 rotate-12"
      />
      <img
        src={adinka}
        alt="adinkra"
        className="absolute top-1/4 right-24 w-14 opacity-20 hidden md:block"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-heading mb-6 text-accent drop-shadow-lg">
          The Soul of a Continent, Told Through Time
        </h2>
        <p className="text-lg md:text-xl font-body max-w-3xl mx-auto text-light/90">
          Every rhythm, every symbol, every story — an echo of who we were and
          who we’re becoming. From the deserts of Mali to the forests of Ghana,
          SankofaSeek unites Africa’s memory through culture, craft, and
          connection.
        </p>
        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          <a
            href="/about"
            className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Learn More
          </a>
          <a
            href="/marketplace"
            className="border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-primary transition"
          >
            Explore Marketplace
          </a>
        </div>
      </div>
    </section>
  );
}
