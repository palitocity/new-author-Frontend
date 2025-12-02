import Hero from "../components/Hero";
import StoryCard from "../components/Storycard";
import BlogCard from "../components/Blogcard";

import CultureBody from "../components/culture";
import StoryAnimation from "../components/animatedstory";

const Home = () => {
  return (
    <>
      <Hero />
      <CultureBody />
      <StoryAnimation />
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-heading mb-6 text-center"></h2>

        <div className="grid gap-6 md:grid-cols-3">
          <StoryCard />
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 bg-primary/5">
        <h2 className="text-3xl font-heading mb-6 text-center">
          Latest from the Blog
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <BlogCard />
        </div>
      </section>
    </>
  );
};

export default Home;
