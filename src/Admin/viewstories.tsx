/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  BookOpen,
  Edit,
  Trash2,
  Eye,
  User,
  Clock,
  X,
  Save,
} from "lucide-react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

const ViewStories = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [editingStory, setEditingStory] = useState<any>(null);
  const [deleteStory, setDeleteStory] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const token = localStorage.getItem("token");

  // Fetch stories from API
  const getStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/book/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStories(res.data.data || []);
    } catch (error: any) {
      console.error(
        "Error fetching stories:",
        error.response?.data || error.message,
      );
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStories();
  }, []);

  // Handle edit modal open
  const openEditModal = (story: any) => {
    setEditingStory(story);
    setEditFormData({
      title: story.title || "",
      subtitle: story.subtitle || "",
      author: story.author || "",
      narrator: story.narrator || "",
      summary: story.summary || "",
      content: story.content || "",
      category: story.category || "",
      historicalPeriod: story.historicalPeriod || "",
      location: story.location || "",
      readingTime: story.readingTime || "",
      ageRating: story.ageRating || "",
      price: story.price || 0,
      status: story.status || "draft",
    });
  };

  // Handle form input changes
  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Submit edit form
  const handleEditSubmit = async () => {
    try {
      await axios.put(`/book/${editingStory._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Story updated successfully");
      setEditingStory(null);
      getStories(); // Refresh stories
    } catch (error: any) {
      console.error("Edit error:", error.response?.data || error.message);
      toast.error("Failed to update story");
    }
  };

  // Confirm and delete story
  const confirmDeleteStory = async () => {
    try {
      await axios.delete(`/book/${deleteStory._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Story deleted successfully");
      setStories(stories.filter((s) => s._id !== deleteStory._id));
      setDeleteStory(null);
    } catch (error: any) {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error("Failed to delete story");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const formatPrice = (price: number) => `₦${(price ?? 0).toFixed(2)}`;

  const categories = [
    "Folklore & Legends",
    "Historical Fiction",
    "Oral Traditions",
    "Biography & Memoirs",
    "Cultural Tales",
    "War & Resistance",
    "Family Stories",
    "Mythology",
  ];

  const historicalPeriods = [
    "Ancient Times (Before 500 CE)",
    "Medieval Period (500-1500 CE)",
    "Early Modern (1500-1800)",
    "Colonial Era (1800-1960)",
    "Independence Era (1960-1990)",
    "Contemporary (1990-Present)",
  ];

  const ageRatings = ["All Ages", "8+", "12+", "16+", "18+"];

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Stories Library
        </h1>
        <p className="text-stone-600">Manage and view all published stories</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Total Stories</p>
            <BookOpen className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">{stories.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Published</p>
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">
            {stories.filter((s) => s.status === "published").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Draft</p>
            <BookOpen className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">
            {stories.filter((s) => s.status === "draft").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Total Views</p>
            <Eye className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">
            {stories
              .reduce((acc, s) => acc + (s.views || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {loading && <p className="text-stone-600">Loading stories...</p>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      story.status,
                    )}`}
                  >
                    {story.status}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {story.ageRating}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    {story.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-1 line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-sm text-stone-600 mb-3 line-clamp-2">
                  {story.summary}
                </p>

                <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{story.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{story.readingTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-stone-400" />
                    <span className="text-sm text-stone-600">
                      {(story.views ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">
                    {formatPrice(story.price)}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSelectedStory(story)}
                    className="flex-1 px-3 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>

                  {story.pdfFile && (
                    <a
                      href={story.pdfFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-4 h-4" /> PDF
                    </a>
                  )}

                  <button
                    onClick={() => openEditModal(story)}
                    className="flex-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>

                  <button
                    onClick={() => setDeleteStory(story)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-800">
                Story Details
              </h2>
              <button
                onClick={() => setSelectedStory(null)}
                className="p-2 hover:bg-stone-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedStory.coverImage}
                alt={selectedStory.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              <h1 className="text-3xl font-bold text-stone-800 mb-2">
                {selectedStory.title}
              </h1>
              {selectedStory.subtitle && (
                <p className="text-xl text-stone-600 mb-4">
                  {selectedStory.subtitle}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-500 mb-1">Author</p>
                  <p className="font-semibold text-stone-800">
                    {selectedStory.author}
                  </p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-500 mb-1">Category</p>
                  <p className="font-semibold text-stone-800">
                    {selectedStory.category}
                  </p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-500 mb-1">Reading Time</p>
                  <p className="font-semibold text-stone-800">
                    {selectedStory.readingTime}
                  </p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <p className="text-xs text-stone-500 mb-1">Age Rating</p>
                  <p className="font-semibold text-stone-800">
                    {selectedStory.ageRating}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-stone-700 mb-2">
                  Summary
                </p>
                <p className="text-stone-600">{selectedStory.summary}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-stone-700 mb-2">
                  Story Content
                </p>
                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="text-stone-700 whitespace-pre-wrap">
                    {selectedStory.content}
                  </p>
                </div>
              </div>

              {selectedStory.pdfFile && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-stone-700 mb-2">
                    Story PDF
                  </p>

                  <div className="rounded-lg overflow-hidden border border-stone-200">
                    <iframe
                      src={selectedStory.pdfFile}
                      className="w-full h-[500px]"
                      title="Story PDF"
                    />
                  </div>

                  <a
                    href={selectedStory.pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-amber-600 hover:text-amber-700 font-medium text-sm"
                  >
                    Open PDF in new tab →
                  </a>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedStory(null);
                    openEditModal(selectedStory);
                  }}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Story
                </button>
                <button
                  onClick={() => {
                    setSelectedStory(null);
                    setDeleteStory(selectedStory);
                  }}
                  className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Story Modal */}
      {editingStory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-800">Edit Story</h2>
              <button
                onClick={() => setEditingStory(null)}
                className="p-2 hover:bg-stone-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {editingStory?.pdfFile && (
              <div className="bg-stone-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-stone-600 mb-1">Current PDF</p>
                <a
                  href={editingStory.pdfFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 font-medium text-sm"
                >
                  View uploaded PDF →
                </a>
              </div>
            )}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={editFormData.subtitle}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={editFormData.author}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Narrator
                    </label>
                    <input
                      type="text"
                      name="narrator"
                      value={editFormData.narrator}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Summary *
                  </label>
                  <textarea
                    name="summary"
                    value={editFormData.summary}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={editFormData.content}
                    onChange={handleEditInputChange}
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Historical Period
                    </label>
                    <select
                      name="historicalPeriod"
                      value={editFormData.historicalPeriod}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    >
                      <option value="">Select period</option>
                      {historicalPeriods.map((period, idx) => (
                        <option key={idx} value={period}>
                          {period}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData.location}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Reading Time
                    </label>
                    <input
                      type="text"
                      name="readingTime"
                      value={editFormData.readingTime}
                      onChange={handleEditInputChange}
                      placeholder="e.g., 10 minutes"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Age Rating
                    </label>
                    <select
                      name="ageRating"
                      value={editFormData.ageRating}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    >
                      <option value="">Select rating</option>
                      {ageRatings.map((rating, idx) => (
                        <option key={idx} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Price (in kobo)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    >
                      <option value="draft">Draft</option>
                      <option value="review">Under Review</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingStory(null)}
                  className="flex-1 px-6 py-3 border-2 border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteStory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                Delete Story?
              </h3>
              <p className="text-stone-600">
                Are you sure you want to delete "{deleteStory.title}"? This
                action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteStory(null)}
                className="flex-1 px-6 py-3 border-2 border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStory}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
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

export default ViewStories;
