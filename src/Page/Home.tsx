import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Library,
  LockKeyhole,
  NotebookPen,
  PlayCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const benefits = [
  {
    title: "Curated cultural knowledge",
    text: "Explore books, stories, audio, and research materials selected for depth, context, and care.",
    icon: BookOpen,
  },
  {
    title: "A private continuity library",
    text: "Purchased resources, progress, notes, and bookmarks stay connected in one reader dashboard.",
    icon: Library,
  },
  {
    title: "Respectful access controls",
    text: "Public, paid, member, and protected content can be handled with the right boundaries.",
    icon: ShieldCheck,
  },
];

const steps = [
  "Discover a resource",
  "Unlock access",
  "Continue learning",
];

const previewItems = [
  { title: "Foundations of Adinkra Symbols", progress: 72 },
  { title: "Oral History Field Notes", progress: 48 },
  { title: "Memory and Migration Workbook", progress: 86 },
];

function ProductPreview() {
  return (
    <motion.section
      className="bg-stone-50 px-6 py-14 md:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-90px" }}
      variants={fadeUp}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
            Product Preview
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-stone-950 md:text-5xl">
            Learning that stays organized after the first read
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
            SankofaSeek turns cultural discovery into a reusable library where
            every purchase, bookmark, note, and reading session has a place.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 rounded-md bg-stone-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-stone-800"
            >
              Explore Library
              <Search className="h-4 w-4" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-5 py-3 text-sm font-bold text-stone-900 transition hover:bg-white"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <motion.div
          className="overflow-hidden rounded-lg border border-stone-200 bg-stone-950 shadow-2xl"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="grid gap-0 md:grid-cols-[210px_1fr]">
            <aside className="border-b border-white/10 bg-stone-900 p-5 text-white md:border-b-0 md:border-r">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400 text-stone-950">
                  <Library className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">My Library</p>
                  <p className="text-xs text-stone-400">Saved resources</p>
                </div>
              </div>
              <div className="mt-7 space-y-2 text-sm text-stone-300">
                {["Continue Reading", "Purchases", "Notes", "Bookmarks"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className={`rounded-md px-3 py-2 ${
                        index === 0 ? "bg-white/10 text-white" : ""
                      }`}
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </aside>

            <div className="bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                    Continue Reading
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-stone-950">
                    Memory, Symbol, and Story
                  </h3>
                </div>
                <PlayCircle className="h-9 w-9 text-amber-700" />
              </div>
              <div className="mt-6 space-y-5">
                {previewItems.map((item) => (
                  <div key={item.title}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-stone-800">
                        {item.title}
                      </span>
                      <span className="text-stone-500">{item.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                      <motion.div
                        className="h-full rounded-full bg-linear-to-r from-amber-500 to-teal-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Notes", value: "21", icon: NotebookPen },
                  { label: "Bookmarks", value: "42", icon: BookMarked },
                  { label: "Protected", value: "5", icon: LockKeyhole },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-stone-200 p-3"
                  >
                    <Icon className="h-4 w-4 text-teal-700" />
                    <p className="mt-2 text-xl font-bold text-stone-950">
                      {value}
                    </p>
                    <p className="text-xs text-stone-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <ProductPreview />

      <motion.section
        className="bg-white px-6 py-14 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
              Why SankofaSeek
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-950 md:text-4xl">
              Built for readers who return to knowledge
            </h2>
          </div>
          <motion.div
            className="mt-9 grid gap-5 md:grid-cols-3"
            variants={stagger}
          >
            {benefits.map(({ icon: Icon, text, title }) => (
              <motion.article
                key={title}
                className="rounded-lg border border-stone-200 bg-stone-50 p-5"
                variants={fadeUp}
                whileHover={{ y: -5 }}
              >
                <Icon className="h-7 w-7 text-amber-700" />
                <h3 className="mt-4 text-lg font-bold text-stone-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="bg-stone-950 px-6 py-14 text-white md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-300">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              From discovery to continuity in three steps
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-300">
              The flow is intentionally simple: find meaningful material,
              unlock it, and keep learning from your own dashboard.
            </p>
          </div>
          <motion.div className="grid gap-4 md:grid-cols-3" variants={stagger}>
            {steps.map((step, index) => (
              <motion.article
                key={step}
                className="rounded-lg border border-white/10 bg-white/10 p-5"
                variants={fadeUp}
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-400 text-sm font-bold text-stone-950">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-bold">{step}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  {index === 0
                    ? "Browse cultural books, stories, and learning resources."
                    : index === 1
                      ? "Purchase or sign in to access saved content."
                      : "Resume progress, add notes, and revisit anytime."}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="bg-stone-50 px-6 py-14 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
              Trust
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-950 md:text-4xl">
              More than a marketplace
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              SankofaSeek is designed as a living archive: a place to study,
              preserve, and return to cultural knowledge with context.
            </p>
          </div>
          <motion.blockquote
            className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
            variants={fadeUp}
            whileHover={{ y: -4 }}
          >
            <CheckCircle2 className="h-8 w-8 text-teal-700" />
            <p className="mt-5 text-xl font-semibold leading-8 text-stone-900">
              "The continuity library makes learning feel personal. My notes,
              bookmarks, and progress all stay connected."
            </p>
            <footer className="mt-5 text-sm font-semibold text-stone-500">
              David O., lifelong learner
            </footer>
          </motion.blockquote>
        </div>
      </motion.section>

      <motion.section
        className="bg-white px-6 py-14 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-90px" }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="container mx-auto rounded-lg border border-stone-200 bg-stone-950 px-6 py-10 text-center text-white shadow-xl md:px-10"
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-3xl font-bold md:text-4xl">
            Start building your continuity library
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-300">
            Create an account, explore the library, and keep meaningful
            cultural knowledge close.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-stone-950 transition hover:bg-amber-300"
            >
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/library"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              View Library
              <Search className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </motion.section>
    </>
  );
}
