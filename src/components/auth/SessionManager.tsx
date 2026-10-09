import { useCallback, useEffect, useState } from "react";
import { Clock, Loader2 } from "lucide-react";
import axios from "../../config/axiosconfiq";
import { logout, setToken } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAdminSession, decodeJwt } from "../../utils/session";

// Sessions last 1 hour (server SESSION_TTL). This long before expiry we ask
// whether the person is still there and offer to extend.
const WARNING_MS = 5 * 60 * 1000;

// Pages that need a signed-in user; leaving one of these on expiry.
const USER_ONLY_PATHS = /^\/(dashboard|reader|checkout|order|verify|library\/)/;

type SessionKind = "user" | "admin";

const formatCountdown = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const isAdminArea = (path: string) =>
  path.startsWith("/admin") && !path.startsWith("/admin/login");

/**
 * Keeps sign-in sessions alive for active people: shortly before the
 * token expires it asks "Are you still there?", refreshes the token if
 * they confirm, and signs them out if they don't.
 */
export default function SessionManager() {
  const dispatch = useAppDispatch();
  const userToken = useAppSelector((state) => state.auth.token);
  const [adminToken, setAdminToken] = useState(() =>
    localStorage.getItem("adminToken"),
  );
  const [now, setNow] = useState(() => Date.now());
  const [path, setPath] = useState(() => window.location.pathname);
  const [extending, setExtending] = useState(false);
  const [error, setError] = useState("");

  // One tick per second drives the countdown and picks up logins,
  // logouts and navigation that happened elsewhere.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
      setPath(window.location.pathname);
      setAdminToken(localStorage.getItem("adminToken"));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  // Keep the user session in sync across tabs (extended or signed out
  // in another tab).
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "authToken") return;
      if (event.newValue) dispatch(setToken(event.newValue));
      else dispatch(logout());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [dispatch]);

  const kind: SessionKind | null = isAdminArea(path)
    ? adminToken
      ? "admin"
      : null
    : userToken
      ? "user"
      : null;
  const token = kind === "admin" ? adminToken : kind === "user" ? userToken : null;
  const exp = decodeJwt(token)?.exp;
  const remaining = typeof exp === "number" ? exp * 1000 - now : null;

  const endSession = useCallback(
    (sessionKind: SessionKind) => {
      setError("");

      if (sessionKind === "admin") {
        clearAdminSession();
        setAdminToken(null);
        window.location.assign("/admin/login");
        return;
      }

      dispatch(logout());
      if (USER_ONLY_PATHS.test(window.location.pathname)) {
        window.location.assign("/session-expired");
      }
    },
    [dispatch],
  );

  const expired = kind !== null && remaining !== null && remaining <= 0;

  useEffect(() => {
    if (expired && kind) endSession(kind);
  }, [expired, kind, endSession]);

  const extendSession = async () => {
    if (!kind) return;

    try {
      setExtending(true);
      setError("");

      const res = await axios.post(
        kind === "admin" ? "/admin/refresh" : "/auth/refresh",
      );
      const newToken: string | undefined = res.data?.data?.token;
      if (!newToken) throw new Error("No token returned");

      if (kind === "admin") {
        localStorage.setItem("adminToken", newToken);
        setAdminToken(newToken);
      } else {
        dispatch(setToken(newToken));
      }
    } catch {
      setError("We couldn't extend your session. Please sign in again.");
    } finally {
      setExtending(false);
    }
  };

  const showPrompt =
    kind !== null && remaining !== null && remaining > 0 && remaining <= WARNING_MS;

  if (!showPrompt || !kind || remaining === null) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-prompt-title"
    >
      <div className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 text-center shadow-2xl">
        <Clock className="mx-auto h-10 w-10 text-amber-700" />
        <h2
          id="session-prompt-title"
          className="mt-3 text-xl font-bold text-stone-950"
        >
          Are you still there?
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          For your security you'll be signed out in{" "}
          <span className="font-bold tabular-nums text-stone-950">
            {formatCountdown(remaining)}
          </span>
          . Stay signed in to keep going.
        </p>

        {error && (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => endSession(kind)}
            className="rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-50"
          >
            Sign out
          </button>
          <button
            type="button"
            onClick={extendSession}
            disabled={extending}
            autoFocus
            className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
          >
            {extending && <Loader2 className="h-4 w-4 animate-spin" />}
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  );
}
