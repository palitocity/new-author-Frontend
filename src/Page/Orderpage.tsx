/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../config/axiosconfiq";
import OrderModal from "../components/ordermodal"; // import the modal

type Story = {
  _id: string;
  coverImage: string;
  title: string;
  description: string;
  price: number;
  author: string;
  createdAt: string;
  category: string;
  pages: number;
};

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFree = story?.price === 0;

  useEffect(() => {
    const getStoryById = async () => {
      try {
        const res = await axios.get(`/book/${id}`);
        setStory(res.data.data);
      } catch (error: any) {
        console.error("Failed to fetch story", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getStoryById();
  }, [id]);

  if (loading) return <p className="text-center py-20">Loading story…</p>;
  if (!story) return <p className="text-center py-20">Story not found</p>;

  const totalPrice = isFree ? 0 : story.price * quantity;

  const handleConfirm = () => {
    if (isFree) {
      setOrderConfirmed(true);
      setTimeout(() => setOrderConfirmed(false), 3000);
    } else {
      setIsModalOpen(true); // open modal for paid story
    }
  };

  const handlePaymentSuccess = (userInfo: any) => {
    console.log("User info for admin:", userInfo);
    setOrderConfirmed(true);
    setTimeout(() => setOrderConfirmed(false), 3000);
    // Here you can also trigger API to record the order + user info
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {orderConfirmed && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-emerald-800 font-medium">
              {isFree
                ? "Story added to your library!"
                : "Order confirmed successfully!"}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/5">
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>

            <div className="md:w-3/5 p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{story.title}</h1>
                  <p className="text-stone-600">by {story.author}</p>
                </div>
                {isFree && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    FREE
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-stone-500">Category</p>
                  <p className="font-medium">{story.category}</p>
                </div>
                <div>
                  <p className="text-stone-500">Pages</p>
                  <p className="font-medium">{story.pages}</p>
                </div>
                <div>
                  <p className="text-stone-500">Published</p>
                  <p className="font-medium">
                    {new Date(story.createdAt).toDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-stone-500">Story ID</p>
                  <p className="font-medium">#{story._id}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-stone-600">{story.description}</p>
              </div>

              <div className="border-t pt-6">
                {!isFree && (
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-medium">Quantity</span>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 border rounded"
                    >
                      −
                    </button>
                    <span className="font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-sm text-stone-500">Total Price</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {isFree ? "FREE" : `₦${totalPrice.toLocaleString()}`}
                  </p>
                </div>

                <button
                  onClick={handleConfirm}
                  className={`w-full py-3 rounded-lg font-semibold text-white ${
                    isFree
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {isFree ? "Add to Library" : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong>{" "}
            {isFree
              ? "This story is free and can be read immediately."
              : "You’ll gain access after completing payment."}
          </p>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storyTitle={story.title}
        totalPrice={totalPrice}
        onPaymentSuccess={handlePaymentSuccess}
        storyId={story._id} // ✅ actual book ID
        quantity={quantity} // ✅ actual quantity
      />
    </div>
  );
}
