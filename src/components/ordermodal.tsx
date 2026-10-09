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

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("card");

  const [coin, setCoin] = useState(CRYPTO_COINS[0].code);

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);

  const [cryptoPayment, setCryptoPayment] = useState<{
    reference: string;
    address: string;
    coin: string;
    amount: number;
    currency: string;
    coinAmount: number | null;
    qrCode: string | null;
  } | null>(null);

  const [cryptoStatus, setCryptoStatus] = useState<
    "pending" | "Paid" | "Failed" | "Cancelled"
  >("pending");

  const [cancelling, setCancelling] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCryptoPayment(null);
      setCryptoStatus("pending");
      setTurnstileToken("");

      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
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
      userInfo: {
        name,
        email: normalizedEmail,
        phone,
        address,
      },
      turnstileToken,
    });

    if (!orderRes.data.success) {
      throw new Error(
        orderRes.data.error || "Failed to create order",
      );
    }

    return orderRes.data.data._id as string;
  };

  const handleCardPayment = async () => {
    const orderId = await createOrder();

    const transactionRes = await axios.post(
      "/transactions/initialize",
      {
        orderId,
      },
    );

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
      throw new Error(
        res.data.error || "Failed to initialize crypto payment",
      );
    }

    const data = res.data.data;

    setCryptoPayment(data);
    setCryptoStatus("pending");

    pollRef.current = setInterval(async () => {
      try {
        const statusRes = await axios.get(
          `/crypto/status/${data.reference}`,
        );

        const status =
          statusRes.data?.data?.paymentStatus;

        if (
          status === "Paid" ||
          status === "Failed" ||
          status === "Cancelled"
        ) {
          setCryptoStatus(status);

          if (pollRef.current) {
            clearInterval(pollRef.current);
          }
        }
      } catch {
        // Transient polling error, keep trying
      }
    }, 5000);
  };

  const handleCancelCrypto = async () => {
    if (!cryptoPayment) return;

    setCancelling(true);

    try {
      await axios.post(
        `/crypto/cancel/${cryptoPayment.reference}`,
      );

      if (pollRef.current) {
        clearInterval(pollRef.current);
      }

      setCryptoStatus("Cancelled");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "Failed to cancel order",
      );
    } finally {
      setCancelling(false);
    }
  };

  const handlePayment = async () => {
    if (!name || !email || !phone || !address) {
      toast.error("Please fill all fields!");
      return;
    }

    if (!turnstileToken) {
      toast.error(
        "Please complete the verification challenge.",
      );
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
        err.response?.data?.error ||
          err.message ||
          "Payment failed",
      );
    } finally {
      setLoading(false);
      // Turnstile tokens are single-use.
      setTurnstileToken("");
      setTurnstileReset((count) => count + 1);
    }
  };

  const copyAddress = () => {
    if (!cryptoPayment) return;

    navigator.clipboard.writeText(
      cryptoPayment.address,
    );

    toast.success("Address copied");
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-3
        sm:p-4
      "
    >
      <div
        className="
          relative
          w-full
          max-w-md
          max-h-[92vh]
          overflow-x-hidden
          overflow-y-auto
          rounded-xl
          bg-white
          p-4
          sm:p-6
        "
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close modal"
          className="
            absolute
            right-3
            top-3
            z-10
            text-xl
            font-bold
            text-stone-400
            transition
            hover:text-stone-600
          "
          onClick={() => {
            if (
              cryptoPayment &&
              cryptoStatus === "pending"
            ) {
              handleCancelCrypto();
            }

            onClose();
          }}
        >
          ×
        </button>

        {cryptoPayment ? (
          <>
            {/* =========================
                CRYPTO PAYMENT
            ========================== */}

            <h2 className="mb-4 pr-8 text-xl font-bold sm:text-2xl">
              Pay with Crypto
            </h2>

            {cryptoStatus === "Paid" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />

                <p className="font-semibold text-emerald-700">
                  Payment confirmed!
                </p>

                <p className="text-sm text-stone-600">
                  {storyTitle} has been added to your
                  library.
                </p>

                <button
                  onClick={onClose}
                  className="
                    mt-2
                    w-full
                    rounded-lg
                    bg-emerald-600
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-emerald-700
                  "
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
                  Please contact support if you already
                  sent funds.
                </p>

                <button
                  onClick={() =>
                    setCryptoPayment(null)
                  }
                  className="
                    mt-2
                    w-full
                    rounded-lg
                    bg-amber-600
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-amber-700
                  "
                >
                  Try Again
                </button>
              </div>
            ) : cryptoStatus === "Cancelled" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <p className="font-semibold text-stone-700">
                  Order cancelled.
                </p>

                <p className="text-sm text-stone-600">
                  You have not been charged. You can
                  close this window.
                </p>

                <button
                  onClick={onClose}
                  className="
                    mt-2
                    w-full
                    rounded-lg
                    bg-stone-700
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-stone-800
                  "
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-stone-600">
                  Send exactly{" "}
                  <strong>
                    {cryptoPayment.coinAmount ?? "—"}{" "}
                    {cryptoPayment.coin.toUpperCase()}
                  </strong>{" "}
                  (≈ {cryptoPayment.amount}{" "}
                  {cryptoPayment.currency}) to the
                  address below.
                </p>

                {/* QR Code */}
                {cryptoPayment.qrCode && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={cryptoPayment.qrCode}
                      alt="Payment QR code"
                      className="
                        h-36
                        w-36
                        max-w-full
                        object-contain
                        sm:h-40
                        sm:w-40
                      "
                    />
                  </div>
                )}

                {/* Wallet Address */}
                <div
                  className="
                    mb-4
                    flex
                    min-w-0
                    items-center
                    gap-2
                    rounded
                    border
                    bg-stone-50
                    px-3
                    py-2
                  "
                >
                  <code className="min-w-0 flex-1 break-all text-xs">
                    {cryptoPayment.address}
                  </code>

                  <button
                    type="button"
                    onClick={copyAddress}
                    aria-label="Copy address"
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4 text-stone-500 transition hover:text-stone-800" />
                  </button>
                </div>

                {/* Payment Status */}
                <div className="mb-4 flex items-center justify-center gap-2 text-center text-sm text-stone-500">
                  <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" />

                  <span>
                    Waiting for payment confirmation…
                  </span>
                </div>

                {/* Cancel */}
                <button
                  onClick={handleCancelCrypto}
                  disabled={cancelling}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-stone-300
                    py-2.5
                    text-sm
                    font-semibold
                    text-stone-600
                    transition
                    hover:bg-stone-100
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {/* =========================
                ORDER FORM
            ========================== */}

            <h2 className="mb-4 pr-8 text-xl font-bold sm:text-2xl">
              Complete Your Order
            </h2>

            <p className="mb-4 text-sm text-stone-600 sm:text-base">
              You are purchasing{" "}
              <strong>{storyTitle}</strong> for{" "}
              <strong>
                ₦{totalPrice.toLocaleString()}
              </strong>
            </p>

            {/* User Information */}
            <div className="mb-4 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="
                  w-full
                  rounded
                  border
                  px-3
                  py-2
                  outline-none
                  transition
                  focus:border-amber-500
                "
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="
                  w-full
                  rounded
                  border
                  px-3
                  py-2
                  outline-none
                  transition
                  focus:border-amber-500
                "
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="
                  w-full
                  rounded
                  border
                  px-3
                  py-2
                  outline-none
                  transition
                  focus:border-amber-500
                "
              />

              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                className="
                  w-full
                  rounded
                  border
                  px-3
                  py-2
                  outline-none
                  transition
                  focus:border-amber-500
                "
              />
            </div>

            {/* Payment Method */}
            <p className="mb-2 text-sm font-medium">
              Payment Method
            </p>

            <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("card")
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  px-2
                  py-2.5
                  text-xs
                  font-semibold
                  transition
                  sm:px-3
                  sm:text-sm
                  ${
                    paymentMethod === "card"
                      ? "border-amber-600 bg-amber-50 text-amber-700"
                      : "border-stone-300 text-stone-600 hover:bg-stone-50"
                  }
                `}
              >
                <CreditCard className="h-4 w-4 shrink-0" />

                <span>Card / Bank</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setPaymentMethod("crypto")
                }
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  px-2
                  py-2.5
                  text-xs
                  font-semibold
                  transition
                  sm:px-3
                  sm:text-sm
                  ${
                    paymentMethod === "crypto"
                      ? "border-amber-600 bg-amber-50 text-amber-700"
                      : "border-stone-300 text-stone-600 hover:bg-stone-50"
                  }
                `}
              >
                <Coins className="h-4 w-4 shrink-0" />

                <span>Crypto</span>
              </button>
            </div>

            {/* Crypto Currency */}
            {paymentMethod === "crypto" && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Select currency
                </label>

                <select
                  value={coin}
                  onChange={(e) =>
                    setCoin(e.target.value)
                  }
                  className="
                    w-full
                    rounded
                    border
                    px-3
                    py-2
                    text-sm
                    outline-none
                    focus:border-amber-500
                  "
                >
                  {CRYPTO_COINS.map((c) => (
                    <option
                      key={c.code}
                      value={c.code}
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* =========================
                RESPONSIVE TURNSTILE
            ========================== */}

            <div
              className="
                mb-4
                flex
                w-full
                justify-center
                overflow-hidden
              "
            >
              <div
                className="
                  flex
                  w-full
                  max-w-[304px]
                  justify-center
                  overflow-hidden
                "
              >
                <Turnstile
                  className="w-full max-w-[304px]"
                  resetKey={turnstileReset}
                  onVerify={setTurnstileToken}
                  onExpire={() =>
                    setTurnstileToken("")
                  }
                />
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={
                loading || !turnstileToken
              }
              className={`
                w-full
                rounded-lg
                py-3
                font-semibold
                text-white
                transition
                ${
                  loading || !turnstileToken
                    ? "cursor-not-allowed bg-stone-400"
                    : "bg-amber-600 hover:bg-amber-700"
                }
              `}
            >
              {loading
                ? "Processing..."
                : "Proceed to Payment"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}