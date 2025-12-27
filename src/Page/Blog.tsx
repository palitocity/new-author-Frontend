import { useEffect, useState } from "react";
import axios from "../config/axiosconfiq";
import BlogCard from "../components/Blogcard";

type BlogType = {
  _id: string;
  featuredImage: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  category: string;
  readingTime?: number;
};

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const res = await axios.get("/blog"); // Adjust the endpoint if needed
        setBlogs(res.data.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllBlogs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-32 text-stone-600">Loading stories...</div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-stone-800 mb-3">Latest Blog</h1>
        <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            image={blog.featuredImage}
            title={blog.title}
            excerpt={blog.excerpt}
            author={blog.author}
            date={new Date(blog.createdAt).toLocaleDateString()}
            category={blog.category}
            readTime={blog.readingTime ? `${blog.readingTime} min read` : "—"}
          />
        ))}
      </div>
    </section>
  );
}
