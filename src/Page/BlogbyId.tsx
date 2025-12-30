/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "../config/axiosconfiq";
import { useParams } from "react-router-dom";

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  publishDate?: string;
}

const BlogbyId = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBlogById = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/blog/${id}`);
      setBlog(res.data.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to load the story");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getBlogById();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600 mx-auto mb-4" />
          <p className="text-stone-600">Loading story…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-stone-50">
        <div className="text-center max-w-md px-4">
          <p className="text-amber-700 text-lg mb-4">{error}</p>
          <button
            onClick={getBlogById}
            className="px-5 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-stone-50">
        <p className="text-stone-600 text-lg">Story not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-stone-50">
      <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-200">
        {blog.featuredImage && (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-72 object-cover"
          />
        )}

        <div className="p-6 md:p-10">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-stone-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-stone-600">
              <span className="italic">By {blog.author}</span>

              {blog.publishDate && (
                <span>
                  {new Date(blog.publishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}

              {blog.category && (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                  {blog.category}
                </span>
              )}
            </div>
          </header>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-stone-700 italic mb-8 border-l-4 border-amber-600 pl-4">
              {blog.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-stone max-w-none leading-relaxed">
            <div className="whitespace-pre-wrap">{blog.content}</div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <footer className="mt-10 pt-6 border-t border-stone-200">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogbyId;
