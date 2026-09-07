/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";
import { CreditCard, Coins, Copy, CheckCircle2 } from "lucide-react";
import Turnstile from "./Turnstile";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  storyTitle: string;
  totalPrice: number;
  quantity: number;
}

type PaymentMethod = "card" | "crypto";

const CRYPTO_COINS = [
  { code: "btc", label: "Bitcoin (BTC)" },
  { code: "eth", label: "Ethereum (ETH)" },
  { code: "trx_usdt", label: "USDT (Tron/TRC20)" },
  { code: "bep20_usdt", label: "USDT (BNB Smart Chain)" },
  { code: "ltc", label: "Litecoin (LTC)" },
];

export default function OrderModal({
  isOpen,
  onClose,
  storyId,
  storyTitle,
  totalPrice,
  quantity,
}: OrderModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [coin, setCoin] = useState(CRYPTO_COINS[0].code);
  const [turnstileToken, setTurnstileToken] = useState("");

  const [cryptoPayment, setCryptoPayment] = useState<{
    reference: string;
    address: string;
    coin: string;
    amount: number;
    currency: string;
    qrCode: string | null;
  } | null>(null);
  const [cryptoStatus, setCryptoStatus] = useState<"pending" | "Paid" | "Failed">(
    "pending",
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCryptoPayment(null);
      setCryptoStatus("pending");
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, [isOpen]);

  const createOrder = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    localStorage.setItem("userEmail", normalizedEmail);

    const orderRes = await axios.post("/order", {
      items: [
        {
          book: storyId,
          quantity,
          priceAtPurchase: totalPrice / quantity,
        },
      ],
      userInfo: { name, email: normalizedEmail, phone, address },
      turnstileToken,
    });

    if (!orderRes.data.success) {
      throw new Error(orderRes.data.error || "Failed to create order");
    }

    return orderRes.data.data._id as string;
  };

  const handleCardPayment = async () => {
    const orderId = await createOrder();

    const transactionRes = await axios.post("/transactions/initialize", {
      orderId,
    });

    if (!transactionRes.data.success) {
      throw new Error("Failed to initialize payment");
    }

    const { authorization_url } = transactionRes.data.data;
    window.location.href = authorization_url;
  };

  const handleCryptoPayment = async () => {
    const orderId = await createOrder();

    const res = await axios.post("/crypto/initialize", {
      orderId,
      coin,
    });

    if (!res.data.success) {
      throw new Error(res.data.error || "Failed to initialize crypto payment");
    }

    const data = res.data.data;
    setCryptoPayment(data);
    setCryptoStatus("pending");

    pollRef.current = setInterval(async () => {
      try {
        const statusRes = await axios.get(`/crypto/status/${data.reference}`);
        const status = statusRes.data?.data?.paymentStatus;
        if (status === "Paid" || status === "Failed") {
          setCryptoStatus(status);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // transient polling error, keep trying
      }
    }, 5000);
  };

  const handlePayment = async () => {
    if (!name || !email || !phone || !address) {
      toast.error("Please fill all fields!");
      return;
    }

    if (!turnstileToken) {
      toast.error("Please complete the verification challenge.");
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "card") {
        await handleCardPayment();
      } else {
        await handleCryptoPayment();
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || err.message || "Payment failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    if (!cryptoPayment) return;
    navigator.clipboard.writeText(cryptoPayment.address);
    toast.success("Address copied");
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

        {cryptoPayment ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Pay with Crypto</h2>

            {cryptoStatus === "Paid" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                <p className="font-semibold text-emerald-700">
                  Payment confirmed!
                </p>
                <p className="text-sm text-stone-600">
                  {storyTitle} has been added to your library.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 w-full py-3 rounded-lg text-white font-semibold bg-emerald-600 hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            ) : cryptoStatus === "Failed" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <p className="font-semibold text-red-700">
                  Payment could not be verified.
                </p>
                <p className="text-sm text-stone-600">
                  Please contact support if you already sent funds.
                </p>
                <button
                  onClick={() => setCryptoPayment(null)}
                  className="mt-2 w-full py-3 rounded-lg text-white font-semibold bg-amber-600 hover:bg-amber-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-stone-600 text-sm">
                  Send exactly{" "}
                  <strong>
                    {cryptoPayment.amount} {cryptoPayment.currency}
                  </strong>{" "}
                  worth of{" "}
                  <strong>{cryptoPayment.coin.toUpperCase()}</strong> to the
                  address below.
                </p>

                {cryptoPayment.qrCode && (
                  <img
                    src={cryptoPayment.qrCode}
                    alt="Payment QR code"
                    className="mx-auto mb-4 h-40 w-40"
                  />
                )}

                <div className="flex items-center gap-2 mb-4 border rounded px-3 py-2 bg-stone-50">
                  <code className="text-xs break-all flex-1">
                    {cryptoPayment.address}
                  </code>
                  <button onClick={copyAddress} aria-label="Copy address">
                    <Copy className="h-4 w-4 text-stone-500 hover:text-stone-800" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-stone-500 justify-center">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  Waiting for payment confirmation…
                </div>
              </>
            )}
          </>
        ) : (
          <>
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

            <p className="text-sm font-medium mb-2">Payment Method</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold ${
                  paymentMethod === "card"
                    ? "border-amber-600 bg-amber-50 text-amber-700"
                    : "border-stone-300 text-stone-600"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Card / Bank
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("crypto")}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold ${
                  paymentMethod === "crypto"
                    ? "border-amber-600 bg-amber-50 text-amber-700"
                    : "border-stone-300 text-stone-600"
                }`}
              >
                <Coins className="h-4 w-4" />
                Crypto
              </button>
            </div>

            {paymentMethod === "crypto" && (
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 block">
                  Select currency
                </label>
                <select
                  value={coin}
                  onChange={(e) => setCoin(e.target.value)}
                  className="border rounded px-3 py-2 w-full text-sm"
                >
                  {CRYPTO_COINS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Turnstile
              className="mb-4"
              onVerify={setTurnstileToken}
              onExpire={() => setTurnstileToken("")}
            />

            <button
              onClick={handlePayment}
              disabled={loading || !turnstileToken}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                loading ? "bg-stone-400" : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
