import BlogCard from "../components/Blogcard";

export default function Blog() {
  const blogCards = [
    {
      image:
        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
      title: "The Ancient Trails of East Africa",
      excerpt:
        "Journey through centuries of history as we explore the rich cultural heritage and untold stories that have shaped the landscapes we know today.",
      author: "Sarah Johnson",
      date: "Nov 27, 2024",
      category: "Heritage",
      readTime: "8 min read",
    },
    {
      image:
        "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80",
      title: "Guardians of Tradition",
      excerpt:
        "Meet the keepers of ancient wisdom who preserve cultural practices passed down through countless generations in remote villages.",
      author: "Marcus Williams",
      date: "Nov 25, 2024",
      category: "Culture",
      readTime: "6 min read",
    },
    {
      image:
        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",
      title: "Echoes of the Past",
      excerpt:
        "Archaeological discoveries reveal fascinating insights into civilizations that once thrived across the African continent.",
      author: "Dr. Amara Okonkwo",
      date: "Nov 23, 2024",
      category: "History",
      readTime: "10 min read",
    },
  ];
  return (
    <section className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-stone-800 mb-3">
          Heritage Blog
        </h1>
        <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {blogCards.map((card, index) => (
          <BlogCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
}
