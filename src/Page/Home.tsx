import Hero from "../components/Hero";

import CultureBody from "../components/culture";
import StoryAnimation from "../components/animatedstory";
import Blog from "./Blog";
import { BookOpen, Library, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

const readerFeatures = [
  {
    title: "Own Your Reads",
    text: "Purchased books and premium stories stay saved in your personal library.",
    icon: Library,
  },
  {
    title: "Continue Anytime",
    text: "Return to your stories, audio, video, and books from one reader dashboard.",
    icon: BookOpen,
  },
  {
    title: "Premium Access",
    text: "Paid content is unlocked only for your account after successful payment.",
    icon: LockKeyhole,
  },
];

const Home = () => {
  return (
    <>
      <Hero />
      <CultureBody />
      <StoryAnimation />
      <section className="bg-stone-50 px-6 py-16">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-700">
              Reader Access
            </p>
            <h2 className="mt-3 text-3xl font-heading font-bold text-stone-950 md:text-4xl">
              Your purchased stories belong in your private dashboard
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Browse premium content after signing in, complete payment, and
              keep every unlocked story or book in your personal library.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {readerFeatures.map(({ icon: Icon, text, title }) => (
              <article
                key={title}
                className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
              >
                <Icon className="h-7 w-7 text-amber-700" />
                <h3 className="mt-4 text-lg font-bold text-stone-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="rounded-md bg-amber-700 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-800"
            >
              Create Reader Account
            </Link>
            <Link
              to="/dashboard/marketplace"
              className="rounded-md border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-white"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 bg-primary/5">
        <div className="grid gap-6 md:grid-cols-1">
          <Blog />
        </div>
      </section>
    </>
  );
};

export default Home;
