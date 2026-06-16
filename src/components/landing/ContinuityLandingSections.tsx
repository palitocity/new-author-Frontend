import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Archive,
  ArrowRight,
  AudioLines,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  GraduationCap,
  History,
  Library,
  LockKeyhole,
  NotebookPen,
  PlayCircle,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  text: string;
  align?: "left" | "center";
  inverse?: boolean;
};

const SectionHeading = ({
  align = "center",
  eyebrow,
  inverse = false,
  text,
  title,
}: SectionHeadingProps) => (
  <motion.div
    className={`mx-auto max-w-3xl ${align === "center" ? "text-center" : ""}`}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={fadeUp}
    transition={{ duration: 0.55, ease: "easeOut" }}
  >
    <p
      className={`text-xs font-bold uppercase tracking-[0.22em] ${
        inverse ? "text-amber-200" : "text-amber-700"
      }`}
    >
      {eyebrow}
    </p>
    <h2
      className={`mt-3 text-3xl font-bold leading-tight md:text-5xl ${
        inverse ? "text-white" : "text-stone-950"
      }`}
    >
      {title}
    </h2>
    <p
      className={`mt-4 text-base leading-7 md:text-lg ${
        inverse ? "text-stone-300" : "text-stone-600"
      }`}
    >
      {text}
    </p>
  </motion.div>
);

const collections = [
  {
    title: "Books",
    text: "Long-form works, cultural studies, and guided reading for deep study.",
    icon: BookOpen,
    tone: "from-amber-100 to-orange-50 text-amber-800",
  },
  {
    title: "Audio Learning",
    text: "Listen to lectures, oral histories, and reflective lessons on the move.",
    icon: AudioLines,
    tone: "from-teal-100 to-cyan-50 text-teal-800",
  },
  {
    title: "Research Packs",
    text: "Curated sources, notes, and documents for focused cultural research.",
    icon: FileText,
    tone: "from-rose-100 to-pink-50 text-rose-800",
  },
  {
    title: "Workbooks",
    text: "Practice prompts and reflection exercises that turn reading into memory.",
    icon: NotebookPen,
    tone: "from-emerald-100 to-lime-50 text-emerald-800",
  },
  {
    title: "Learning Pathways",
    text: "Structured journeys that connect study, reflection, preservation, and sharing.",
    icon: GraduationCap,
    tone: "from-indigo-100 to-sky-50 text-indigo-800",
  },
];

const steps = [
  "Discover Knowledge",
  "Purchase Access",
  "Continue Learning",
  "Track Progress",
  "Build Your Continuity Library",
];

const protectionTiers = [
  {
    title: "Public Knowledge",
    text: "Open stories, cultural introductions, and learning material for discovery.",
    icon: UsersRound,
  },
  {
    title: "Paid Knowledge",
    text: "Premium books, workbooks, audio, and research bundles unlocked by purchase.",
    icon: BookMarked,
  },
  {
    title: "Member Access",
    text: "Saved libraries, reading history, notes, and personalized learning continuity.",
    icon: Library,
  },
  {
    title: "Protected Knowledge",
    text: "Curated access rules for materials that require context, care, or permission.",
    icon: ShieldCheck,
  },
  {
    title: "Sacred Knowledge",
    text: "Restricted resources can remain intentionally limited and respectfully handled.",
    icon: LockKeyhole,
  },
];

const progressItems = [
  {
    title: "Foundations of Adinkra Symbols",
    label: "Continue Reading",
    progress: 72,
    meta: "Last opened 2 hours ago",
    notes: 8,
    bookmarks: 14,
  },
  {
    title: "Oral History Field Notes",
    label: "Research Pack",
    progress: 48,
    meta: "Last opened yesterday",
    notes: 12,
    bookmarks: 6,
  },
  {
    title: "Memory and Migration Workbook",
    label: "Reflection Notes",
    progress: 86,
    meta: "Last opened Jun 12",
    notes: 21,
    bookmarks: 9,
  },
];

const pathway = ["Learn", "Reflect", "Preserve", "Share", "Continue"];

const testimonials = [
  {
    quote:
      "SankofaSeek feels less like a shop and more like a living archive I can return to whenever I need context.",
    name: "Amina K.",
    role: "Research student",
  },
  {
    quote:
      "The continuity library makes learning feel personal. My notes, bookmarks, and progress all stay connected.",
    name: "David O.",
    role: "Lifelong learner",
  },
  {
    quote:
      "I use it to introduce cultural history with more care. The protected access model matters.",
    name: "Nia B.",
    role: "Community educator",
  },
];

const faqs = [
  {
    question: "Is SankofaSeek a marketplace?",
    answer:
      "It supports purchases, but the core experience is a learning library where access, reading progress, research materials, and reflection history stay connected.",
  },
  {
    question: "What happens after I purchase a resource?",
    answer:
      "Unlocked books, stories, audio, and research materials are saved to your personal library so you can continue from where you stopped.",
  },
  {
    question: "How is protected knowledge handled?",
    answer:
      "Resources can be organized by public, paid, member, protected, and restricted access levels so sensitive materials are shared with the right context.",
  },
  {
    question: "Can I track learning progress?",
    answer:
      "Yes. The product experience supports reading percentages, last-opened states, notes, bookmarks, and learning history.",
  },
];

const AnimatedCounter = ({
  label,
  suffix = "",
  value,
}: {
  label: string;
  suffix?: string;
  value: number;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const totalFrames = 70;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));

      if (progress === 1) {
        window.clearInterval(timer);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [inView, value]);

  return (
    <div
      ref={ref}
      className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
    >
      <div className="text-3xl font-bold text-stone-950 md:text-4xl">
        {count.toLocaleString()}
        {suffix}
      </div>
      <p className="mt-2 text-sm font-medium text-stone-500">{label}</p>
      <motion.div
        className="mt-5 h-1.5 rounded-full bg-amber-600"
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(value, 100)}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </div>
  );
};

const DashboardPreview = () => (
  <motion.div
    className="relative mx-auto max-w-5xl"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={fadeUp}
    transition={{ duration: 0.65, ease: "easeOut" }}
  >
    <motion.div
      className="absolute -left-3 top-10 hidden rounded-lg border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur md:block"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
        Bookmark
      </p>
      <p className="mt-1 text-sm font-semibold text-stone-900">
        Chapter 4 saved
      </p>
    </motion.div>

    <motion.div
      className="absolute -right-2 bottom-16 hidden rounded-lg border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur lg:block"
      animate={{ y: [0, 12, 0] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-rose-700">
        Reflection
      </p>
      <p className="mt-1 text-sm font-semibold text-stone-900">
        18 notes linked
      </p>
    </motion.div>

    <div className="overflow-hidden rounded-lg border border-stone-200 bg-stone-950 shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
      </div>
      <div className="grid gap-0 lg:grid-cols-[230px_1fr]">
        <aside className="border-b border-white/10 bg-stone-900 p-5 text-white lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400 text-stone-950">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">My Continuity Library</p>
              <p className="text-xs text-stone-400">28 saved resources</p>
            </div>
          </div>
          <div className="mt-8 space-y-2 text-sm text-stone-300">
            {[
              "Purchased Products",
              "Continue Reading",
              "Reflection Notes",
              "Bookmarks",
              "Learning History",
            ].map((item, index) => (
              <div
                key={item}
                className={`rounded-md px-3 py-2 ${index === 1 ? "bg-white/10 text-white" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
        </aside>

        <div className="bg-stone-50 p-4 sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
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
              <div className="mt-5 space-y-4">
                {progressItems.map((item) => (
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
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <p className="text-sm font-bold text-stone-950">
                  Reflection Notes
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  "Preservation is active. Each note becomes part of the next
                  return."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-stone-200 bg-white p-4">
                  <BookMarked className="h-5 w-5 text-teal-700" />
                  <p className="mt-3 text-2xl font-bold text-stone-950">42</p>
                  <p className="text-xs text-stone-500">Bookmarks</p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-4">
                  <History className="h-5 w-5 text-rose-700" />
                  <p className="mt-3 text-2xl font-bold text-stone-950">116</p>
                  <p className="text-xs text-stone-500">Study sessions</p>
                </div>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <p className="text-sm font-bold text-stone-950">
                  Learning History
                </p>
                <div className="mt-3 space-y-2 text-xs text-stone-500">
                  <p>Opened oral archive notes</p>
                  <p>Saved migration map reference</p>
                  <p>Completed identity workbook prompt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const StatSection = () => (
  <section className="bg-stone-950 px-6 py-16 text-white md:py-20">
    <div className="container mx-auto">
      <div className="grid gap-5 md:grid-cols-3">
        <AnimatedCounter
          label="Knowledge formats supported"
          value={5}
          suffix="+"
        />
        <AnimatedCounter
          label="Learning journey completion target"
          value={80}
          suffix="%"
        />
        <AnimatedCounter
          label="Access levels for protected systems"
          value={5}
        />
      </div>
    </div>
  </section>
);

const Card = ({ children }: { children: ReactNode }) => (
  <motion.article
    className="group rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
    variants={fadeUp}
    whileHover={{ scale: 1.02 }}
  >
    {children}
  </motion.article>
);

export default function ContinuityLandingSections() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [paused]);

  const activeQuote = useMemo(
    () => testimonials[activeTestimonial],
    [activeTestimonial],
  );

  return (
    <div className="overflow-hidden bg-stone-50 text-stone-950">
      <section className="relative px-6 py-20 md:py-24">
        <div className="absolute left-8 top-12 h-24 w-24 rounded-full bg-teal-200/40 blur-2xl" />
        <div className="absolute bottom-12 right-8 h-32 w-32 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="container relative mx-auto">
          <SectionHeading
            eyebrow="Featured Collections"
            title="One library for many ways of knowing"
            text="SankofaSeek gathers books, audio, research packs, workbooks, and pathways into a learning system built for return, reflection, and preservation."
          />

          <motion.div
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {collections.map(({ icon: Icon, text, title, tone }) => (
              <Card key={title}>
                <div
                  className={`grid h-12 w-12 place-items-center rounded-lg bg-linear-to-br ${tone}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-stone-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-24">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="How It Works"
            title="A simple path from discovery to continuity"
            text="The experience connects access, learning, progress, and preservation without making knowledge feel disposable."
          />
          <motion.div
            className="relative mt-14 grid gap-5 lg:grid-cols-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div
              className="absolute left-0 top-8 hidden h-0.5 rounded-full bg-linear-to-r from-amber-500 via-teal-500 to-rose-500 lg:block"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {steps.map((step, index) => (
              <motion.div
                key={step}
                className="relative rounded-lg border border-stone-200 bg-stone-50 p-5 shadow-sm"
                variants={fadeUp}
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-stone-950 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-bold text-stone-950">
                  {step}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {index === 0
                    ? "Search cultural learning materials by topic, format, or learning goal."
                    : "Keep each action connected to your personal learning record."}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <StatSection />

      <section className="px-6 py-20 md:py-24">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="My Continuity Library"
            title="A realistic dashboard for learning that keeps going"
            text="Purchased products, progress tracking, continue-reading cards, reflection notes, bookmarks, and learning history live together."
          />
          <div className="mt-12">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-24">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Knowledge Protection"
            title="Access that respects context"
            text="Not every resource should be treated the same. SankofaSeek can present public, paid, member, protected, and sacred knowledge with clear boundaries."
          />
          <motion.div
            className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {protectionTiers.map(({ icon: Icon, text, title }, index) => (
              <motion.article
                key={title}
                className="rounded-lg border border-stone-200 bg-linear-to-b from-white to-stone-50 p-5 shadow-sm"
                variants={fadeUp}
                whileHover={{ y: -6 }}
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-7 w-7 text-stone-900" />
                  <span className="rounded-full bg-stone-900 px-2.5 py-1 text-xs font-bold text-white">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-stone-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-24">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeading
            align="left"
            eyebrow="Reading Progress"
            title="Pick up exactly where knowledge last met you"
            text="Continue reading, reading percentage, last opened timestamps, notes, and bookmarks are visible at a glance."
          />
          <motion.div
            className="grid gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {progressItems.map((item) => (
              <motion.article
                key={item.title}
                className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
                variants={fadeUp}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
                      {item.label}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-stone-950">
                      {item.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                      <Clock3 className="h-4 w-4" />
                      {item.meta}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-stone-950">
                      {item.progress}%
                    </p>
                    <p className="text-xs text-stone-500">complete</p>
                  </div>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-100">
                  <motion.div
                    className="h-full rounded-full bg-linear-to-r from-teal-500 to-amber-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-stone-500">
                  <span>{item.notes} notes</span>
                  <span>{item.bookmarks} bookmarks</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-stone-950 px-6 py-20 text-white md:py-24">
        <div className="container mx-auto">
          <SectionHeading
            eyebrow="Learning Pathways"
            inverse
            title="Learn, reflect, preserve, share, continue"
            text="Pathways turn isolated resources into a personal journey with visible steps and steady momentum."
          />
          <motion.div
            className="relative mt-14 grid gap-4 md:grid-cols-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div
              className="absolute left-0 top-1/2 hidden h-1 rounded-full bg-linear-to-r from-amber-400 via-teal-400 to-rose-400 md:block"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.25, ease: "easeOut" }}
            />
            {pathway.map((item, index) => (
              <motion.div
                key={item}
                className="relative rounded-lg border border-white/10 bg-white/10 p-5 text-center backdrop-blur"
                variants={fadeUp}
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-stone-950">
                  {index === pathway.length - 1 ? (
                    <Sparkles className="h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  {index === 0
                    ? "Begin with trusted materials."
                    : "Carry the lesson into the next action."}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-24">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            align="left"
            eyebrow="Learner Voices"
            title="Built for people who return to knowledge"
            text="The experience is designed for readers, researchers, educators, and communities who need learning to stay organized over time."
          />

          <div
            className="rounded-lg border border-stone-200 bg-stone-50 p-4 shadow-sm"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.article
                key={activeQuote.name}
                className="rounded-lg bg-white p-7 shadow-sm"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Quote className="h-8 w-8 text-amber-700" />
                <p className="mt-5 text-xl font-semibold leading-8 text-stone-900">
                  "{activeQuote.quote}"
                </p>
                <div className="mt-6">
                  <p className="font-bold text-stone-950">{activeQuote.name}</p>
                  <p className="text-sm text-stone-500">{activeQuote.role}</p>
                </div>
              </motion.article>
            </AnimatePresence>
            <div className="mt-4 flex justify-center gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Show testimonial from ${item.name}`}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeTestimonial
                      ? "w-8 bg-stone-950"
                      : "w-2.5 bg-stone-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-24">
        <div className="container mx-auto grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Questions before you begin"
            text="A few useful details about how SankofaSeek frames learning, access, and continuity."
          />

          <div className="space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={item.question}
                  className="rounded-lg border border-stone-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-stone-950">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-stone-500 transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-6 text-stone-600">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <motion.section
        className="relative overflow-hidden bg-white px-6 py-20 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
      >
        <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="container relative mx-auto">
          <div className="mx-auto max-w-4xl rounded-lg border border-stone-200 bg-linear-to-br from-stone-950 via-stone-900 to-teal-950 p-8 text-center text-white shadow-2xl md:p-12">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-white/10 backdrop-blur">
              <Archive className="h-7 w-7 text-amber-200" />
            </div>
            <h2 className="mt-6 text-3xl font-bold leading-tight md:text-5xl">
              Start Building Your Continuity Library
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-300">
              Purchase, study, revisit, and preserve meaningful knowledge in a
              library designed for lifelong learning.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/library"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-stone-950 transition hover:bg-amber-300"
              >
                Explore Library
                <Search className="h-4 w-4" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
