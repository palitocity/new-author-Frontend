/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "../config/axiosconfiq";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 modal state
  const [showModal, setShowModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<any>(null);

  const token = localStorage.getItem("token");

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "draft":
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/blog/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // open modal
  const openDeleteModal = (blog: any) => {
    setBlogToDelete(blog);
    setShowModal(true);
  };

  // close modal
  const closeModal = () => {
    setShowModal(false);
    setBlogToDelete(null);
  };

  // confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`/blog/${blogToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlogs((prev) => prev.filter((blog) => blog._id !== blogToDelete._id));

      closeModal();
    } catch (error: any) {
      console.error(
        "Failed to delete blog",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
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
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-bold text-lg">{blog.title}</h2>

                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusStyles(
                    blog.status
                  )}`}
                >
                  {blog.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{blog.category}</p>
              <p className="text-sm line-clamp-3">{blog.excerpt}</p>

              <div className="flex justify-between items-center mt-4">
                <a
                  href={`/blog/${blog._id}`}
                  className="text-amber-600 text-sm font-semibold"
                >
                  Read More →
                </a>

                <button
                  onClick={() => openDeleteModal(blog)}
                  className="text-red-600 text-sm font-semibold hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ DELETE CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-2 text-stone-800">
              Delete Blog
            </h2>
            <p className="text-stone-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">“{blogToDelete?.title}”</span>?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
