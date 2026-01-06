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
};

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const BLOGS_PER_PAGE = 6;

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const endIndex = startIndex + BLOGS_PER_PAGE;
  const paginatedBlogs = blogs.slice(startIndex, endIndex);

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const res = await axios.get("/blog");
        setBlogs(res.data.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllBlogs();
  }, []);

  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 🔥 UX polish
  };

  if (loading) {
    return (
      <div className="text-center py-32 text-stone-600">Loading Blogs...</div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-stone-800 mb-3">Latest Blog</h1>
        <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {paginatedBlogs.map((blog) => (
          <BlogCard
            key={blog._id}
            image={blog.featuredImage}
            title={blog.title}
            excerpt={blog.excerpt}
            author={blog.author}
            date={new Date(blog.createdAt).toLocaleDateString()}
            category={blog.category}
            createdAt={
              blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—"
            }
            _id={blog._id}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="px-4 py-2 border rounded-md text-sm disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-4 py-2 rounded-md text-sm ${
                currentPage === i + 1
                  ? "bg-stone-900 text-white"
                  : "border text-stone-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="px-4 py-2 border rounded-md text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
