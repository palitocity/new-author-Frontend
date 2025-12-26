/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "../config/axiosconfiq";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blog");
        setBlogs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((blog: any) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="font-bold text-lg">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{blog.category}</p>
              <p className="text-sm line-clamp-3">{blog.excerpt}</p>

              <a
                href={`/blog/${blog._id}`}
                className="text-amber-600 text-sm font-semibold mt-3 inline-block"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
