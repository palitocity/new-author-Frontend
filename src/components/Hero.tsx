import { ArrowRight, BookOpen, Library, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bg from "../assets/bg.jpg";
import faceken from "../assets/facesofken.jpg";
import westAfrica from "../assets/westafrica.jpg";

const proofPoints = [
  { label: "Curated resources", icon: BookOpen },
  { label: "Personal library", icon: Library },
  { label: "Protected access", icon: ShieldCheck },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-950 px-6 py-16 text-white md:py-24">
      <motion.img
        src={bg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-linear-to-r from-stone-950 via-stone-950/90 to-stone-950/40" />

      <div className="container relative mx-auto grid min-h-[620px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-sm font-bold uppercase tracking-widest text-amber-300">
            SankofaSeek
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
            A living library for cultural knowledge
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-200">
            Discover African heritage stories, books, audio, and research
            materials. Save what you unlock, continue where you stopped, and
            build a personal archive that grows with you.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-6 py-3.5 text-sm font-bold text-stone-950 transition hover:bg-amber-300"
            >
              Start Your Library
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/library"
              className="inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Explore Resources
            </Link>
          </div>

          <motion.div
            className="mt-8 grid gap-3 sm:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
            }}
          >
            {proofPoints.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Icon className="h-5 w-5 text-amber-300" />
                <span className="text-sm font-semibold text-stone-100">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-[0.8fr_1fr] lg:justify-self-end"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <motion.img
            src={faceken}
            alt="Faces representing African heritage and culture"
            className="h-72 w-full rounded-lg object-cover shadow-2xl sm:mt-16"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={westAfrica}
            alt="West African cultural gathering"
            className="h-96 w-full rounded-lg object-cover shadow-2xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
