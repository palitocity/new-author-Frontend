/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../config/axiosconfiq";

export default function VerifyPayment() {
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reference = queryParams.get("reference") || queryParams.get("trxref");

    if (!reference) {
      setStatus("No payment reference found.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(`/transactions/verify/${reference}`);

        if (res.data.success) {
          setStatus("Payment successful! Your library is ready.");
          setTimeout(() => navigate("/library"), 1500);
        } else {
          setStatus("Payment failed or pending.");
        }
      } catch (err: any) {
        setStatus(
          err?.response?.data?.error ||
            err.message ||
            "Error verifying payment.",
        );
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="rounded-lg border border-stone-200 bg-white px-6 py-5 text-center shadow-sm">
        <p className="text-xl font-semibold text-stone-900">{status}</p>
        <p className="mt-2 text-sm text-stone-500">
          Please keep this page open while we confirm your purchase.
        </p>
      </div>
    </div>
  );
}
