import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../config/axiosconfiq";

export default function VerifyPayment() {
  const { reference } = useParams<{ reference: string }>();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    if (!reference) return;

    const verifyPayment = async () => {
      try {
        const res = await axios.get(`/transactions/verify/${reference}`);
        if (res.data.success && res.data.data.status === "success") {
          setStatus("Payment successful! Order confirmed.");
          setTimeout(() => navigate("/library"), 3000); // redirect to library
        } else {
          setStatus("Payment failed or pending.");
        }
      } catch (err) {
        setStatus("Error verifying payment.");
        console.log(err);
      }
    };

    verifyPayment();
  }, [reference, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center text-xl">{status}</p>
    </div>
  );
}
