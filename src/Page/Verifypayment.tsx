import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axiosconfiq";

export default function VerifyPayment() {
  const [status, setStatus] = useState("Verifying...");
  const [success, setSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reference = queryParams.get("reference");

    if (!reference) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("No payment reference found.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(`/transactions/verify/${reference}`);

        if (res.data.success) {
          setSuccess(true);
          setStatus("Payment successful!");
        } else {
          setStatus("Payment failed or pending.");
        }
      } catch (err) {
        setStatus("Error verifying payment.");
        console.log(err);
      }
    };

    verifyPayment();
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {!success ? (
        <p className="text-xl">{status}</p>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">🎉 Payment Successful</h2>
          <p className="text-gray-600 mb-4">Your purchase was successful.</p>
          <p className="text-gray-800 font-medium">
            Kindly check your email for your stories 📚
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            className="mt-6 px-6 py-2 bg-black text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      )}
    </div>
  );
}
