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
    const reference = queryParams.get("reference"); // get from query

    if (!reference) {
      setStatus("No payment reference found.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(`/transactions/verify/${reference}`);

        console.log("🔥 VERIFY RESPONSE:", res);
        console.log("🔥 VERIFY DATA:", res.data);
        if (res.data.success) {
          setStatus("Payment successful! Order confirmed.");
          // setTimeout(() => navigate("/library"), 3000);
        } else {
          setStatus("Payment failed or pending.");
        }
      } catch (err: any) {
        console.log("❌ VERIFY ERROR:", err);
        console.log("❌ ERROR RESPONSE:", err?.response?.data);

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
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center text-xl">{status}</p>
    </div>
  );
}
