/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  storyTitle: string;
  totalPrice: number;
  quantity: number;
  onPaymentSuccess: (userInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => void;
}

export default function OrderModal({
  isOpen,
  onClose,
  storyId,
  storyTitle,
  totalPrice,
  quantity,
  onPaymentSuccess,
}: OrderModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!name || !email || !phone || !address) {
      toast.error("Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      // POST order to backend
      const res = await axios.post("/order", {
        items: [
          {
            book: storyId, // must be valid _id of the story
            quantity, // > 0
            priceAtPurchase: totalPrice,
          },
        ],
        userInfo: { name, email, phone, address },
      });

      if (res.data.success) {
        onPaymentSuccess({ name, email, phone, address });
        onClose();
      } else {
        toast.error("Order failed: " + (res.data.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error(
        "Error creating order: " + (err.response?.data?.error || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-stone-400 hover:text-stone-600 font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
        <p className="mb-4 text-stone-600">
          You are purchasing <strong>{storyTitle}</strong> for{" "}
          <strong>₦{totalPrice.toLocaleString()}</strong>
        </p>

        <div className="flex flex-col gap-3 mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-stone-400" : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          {loading ? "Processing Order..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
