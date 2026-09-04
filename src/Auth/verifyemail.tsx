import {
  ArrowLeft,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useVerifyEmailMutation } from "../services/api";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    (location.state as { email?: string } | null)?.email || "";

  const [digits, setDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [verifyEmail, { isLoading }] =
    useVerifyEmailMutation();

  const [cooldown, setCooldown] = useState(0);

  /* =====================================================
     REDIRECT BACK IF NO EMAIL WAS PASSED
  ===================================================== */

  useEffect(() => {
    if (!email) {
      toast.error(
        "No email found. Please sign up again."
      );

      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  /* =====================================================
     RESEND COOLDOWN TIMER
  ===================================================== */

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((value) => value - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* =====================================================
     DIGIT INPUT HANDLERS
  ===================================================== */

  const handleChange = (
    index: number,
    value: string
  ) => {
    const cleaned = value.replace(/\D/g, "");

    if (!cleaned) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      next[index] = cleaned[cleaned.length - 1];
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });

    setDigits(next);

    const focusIndex = Math.min(
      pasted.length,
      OTP_LENGTH - 1
    );

    inputRefs.current[focusIndex]?.focus();
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const code = digits.join("");

  const onSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (code.length !== OTP_LENGTH) {
      toast.error("Enter the full 6-digit code.");
      return;
    }

    try {
      const response = await verifyEmail({
        email,
        otp: code,
      }).unwrap();

      toast.success(
        response.message || "Email verified successfully!"
      );

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("VERIFY EMAIL ERROR:", error);

      const message =
        (
          error as {
            data?: { message?: string };
            error?: string;
          }
        )?.data?.message ||
        "Verification failed. Check the code and try again.";

      toast.error(message);

      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  /* =====================================================
     RESEND CODE
  ===================================================== */

  const handleResend = async () => {
    if (cooldown > 0) return;

    // TODO: wire this up to your actual resend-otp endpoint/mutation
    toast.success(`A new code was sent to ${email}`);
    setCooldown(RESEND_COOLDOWN);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10 dark:bg-stone-950">
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900"
      >
        {/* =================================================
            HOME
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-amber-700" />

          <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
            Verify your email
          </h1>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
          <Mail className="h-4 w-4" />
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-stone-700 dark:text-stone-200">
            {email || "your email"}
          </span>
        </p>

        {/* =================================================
            OTP INPUTS
        ================================================= */}

        <div
          className="mt-6 flex justify-between gap-2"
          onPaste={handlePaste}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(index, e.target.value)
              }
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-14 w-12 rounded-md border border-stone-300 bg-white text-center text-xl font-bold text-stone-950 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
            />
          ))}
        </div>

        {/* =================================================
            VERIFY BUTTON
        ================================================= */}

        <button
          type="submit"
          disabled={isLoading || code.length !== OTP_LENGTH}
          className="mt-6 w-full rounded-md bg-amber-700 px-4 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>

        {/* =================================================
            RESEND
        ================================================= */}

        <p className="mt-5 text-center text-sm text-stone-500">
          Didn't get a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="font-semibold text-amber-700 disabled:cursor-not-allowed disabled:text-stone-400"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend code"}
          </button>
        </p>

        <p className="mt-2 text-center text-sm text-stone-500">
          Wrong email?{" "}
          <Link
            className="font-semibold text-amber-700"
            to="/signup"
          >
            Go back
          </Link>
        </p>
      </form>
    </main>
  );
}