/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  AlertCircle,
  List,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "../config/axiosconfiq";

type WaitlistRecord = Record<string, unknown>;

type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  note: string;
  createdAt: string;
  additionalFields: string[];
};

const WAITLIST_ENDPOINT =
  "https://sanfossa-backend.onrender.com/api/admin/waitlist";

const ARRAY_KEYS = [
  "waitlist",
  "watchlist",
  "entries",
  "items",
  "results",
  "data",
  "list",
];

const OMITTED_EXTRA_KEYS = new Set([
  "_id",
  "id",
  "name",
  "fullName",
  "full_name",
  "firstName",
  "first_name",
  "lastName",
  "last_name",
  "email",
  "emailAddress",
  "mail",
  "phone",
  "phoneNumber",
  "mobile",
  "whatsapp",
  "status",
  "state",
  "message",
  "note",
  "notes",
  "interest",
  "interests",
  "source",
  "plan",
  "category",
  "createdAt",
  "created_at",
  "submittedAt",
  "joinedAt",
  "subscribedAt",
  "updatedAt",
  "updated_at",
  "isActive",
  "active",
  "isVerified",
  "verified",
  "isApproved",
  "approved",
]);

const isRecord = (value: unknown): value is WaitlistRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toText = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => toText(item))
      .filter((item): item is string => Boolean(item));

    return parts.length > 0 ? parts.join(", ") : null;
  }

  return null;
};

const pickFirstText = (record: WaitlistRecord, keys: string[]) => {
  for (const key of keys) {
    const text = toText(record[key]);

    if (text) {
      return text;
    }
  }

  return null;
};

const toLabel = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const extractWaitlistItems = (payload: unknown): WaitlistRecord[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of ARRAY_KEYS) {
    const nested = payload[key];

    if (Array.isArray(nested)) {
      return nested.filter(isRecord);
    }

    if (isRecord(nested)) {
      const matches = extractWaitlistItems(nested);

      if (matches.length > 0) {
        return matches;
      }
    }
  }

  for (const nested of Object.values(payload)) {
    if (Array.isArray(nested)) {
      const matches = nested.filter(isRecord);

      if (matches.length > 0) {
        return matches;
      }
    }
  }

  for (const nested of Object.values(payload)) {
    if (isRecord(nested)) {
      const matches = extractWaitlistItems(nested);

      if (matches.length > 0) {
        return matches;
      }
    }
  }

  return [];
};

const getDisplayName = (record: WaitlistRecord) => {
  const firstName = pickFirstText(record, ["firstName", "first_name"]);
  const lastName = pickFirstText(record, ["lastName", "last_name"]);
  const combinedName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (combinedName) {
    return combinedName;
  }

  const explicitName = pickFirstText(record, [
    "name",
    "fullName",
    "full_name",
    "username",
  ]);

  if (explicitName) {
    return explicitName;
  }

  const email = pickFirstText(record, ["email", "emailAddress", "mail"]);

  if (email) {
    return email.split("@")[0];
  }

  return "Unnamed entry";
};

const getStatus = (record: WaitlistRecord) => {
  const explicitStatus = pickFirstText(record, ["status", "state"]);

  if (explicitStatus) {
    return explicitStatus;
  }

  if (
    record.isApproved === true ||
    record.approved === true ||
    record.isVerified === true ||
    record.verified === true
  ) {
    return "Approved";
  }

  if (record.isActive === false || record.active === false) {
    return "Inactive";
  }

  if (record.isActive === true || record.active === true) {
    return "Active";
  }

  return "Pending";
};

const buildAdditionalFields = (record: WaitlistRecord) =>
  Object.entries(record)
    .filter(([key, value]) => !OMITTED_EXTRA_KEYS.has(key) && toText(value))
    .slice(0, 3)
    .map(([key, value]) => `${toLabel(key)}: ${toText(value)}`);

const normalizeWaitlistItem = (
  record: WaitlistRecord,
  index: number
): WaitlistEntry => ({
  id:
    pickFirstText(record, ["_id", "id", "email", "phone", "phoneNumber"]) ||
    `entry-${index + 1}`,
  name: getDisplayName(record),
  email: pickFirstText(record, ["email", "emailAddress", "mail"]) || "-",
  phone:
    pickFirstText(record, ["phone", "phoneNumber", "mobile", "whatsapp"]) ||
    "-",
  status: getStatus(record),
  note:
    pickFirstText(record, [
      "message",
      "note",
      "notes",
      "interest",
      "interests",
      "source",
      "plan",
      "category",
    ]) || "-",
  createdAt:
    pickFirstText(record, [
      "createdAt",
      "created_at",
      "submittedAt",
      "joinedAt",
      "subscribedAt",
      "date",
    ]) || "",
  additionalFields: buildAdditionalFields(record),
});

const formatDate = (value: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const getStatusStyles = (status: string) => {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("approved") ||
    normalized.includes("active") ||
    normalized.includes("verified")
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("review") ||
    normalized.includes("new")
  ) {
    return "bg-amber-100 text-amber-700";
  }

  if (
    normalized.includes("reject") ||
    normalized.includes("inactive") ||
    normalized.includes("cancel")
  ) {
    return "bg-red-100 text-red-700";
  }

  return "bg-stone-100 text-stone-700";
};

const Watchlist = () => {
  const token = localStorage.getItem("token");

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);

  const fetchWaitlist = async (isManualRefresh = false) => {
    if (!token) {
      setError("Admin token not found. Please log in again.");
      setEntries([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await axios.get(WAITLIST_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const waitlistItems = extractWaitlistItems(response.data).map(
        normalizeWaitlistItem
      );

      setEntries(waitlistItems);

      if (isManualRefresh) {
        toast.success("Watchlist refreshed");
      }
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        isRecord(err.response.data)
          ? pickFirstText(err.response.data, ["message", "error"]) ||
            "Failed to load watchlist entries."
          : "Failed to load watchlist entries.";

      console.error("Error fetching watchlist:", err);
      setEntries([]);
      setError(errorMessage);

      if (isManualRefresh) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchWaitlist();
  }, []);

  const filteredEntries = entries.filter((entry) =>
    [
      entry.name,
      entry.email,
      entry.phone,
      entry.status,
      entry.note,
      entry.additionalFields.join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

  const totalEmails = entries.filter((entry) => entry.email !== "-").length;
  const totalPhones = entries.filter((entry) => entry.phone !== "-").length;
  const latestDate = entries
    .map((entry) => new Date(entry.createdAt))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => right.getTime() - left.getTime())[0];

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Watchlist</h1>
          <p className="text-stone-600">
            Review entries coming from the admin waitlist endpoint.
          </p>
        </div>

        <button
          onClick={() => void fetchWaitlist(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-amber-600 to-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:from-amber-700 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-stone-600">Total Entries</p>
            <Users className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">
            {entries.length.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-stone-600">Email Contacts</p>
            <Mail className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">
            {totalEmails.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-stone-600">Latest Added</p>
            <List className="h-5 w-5 text-stone-600" />
          </div>
          <p className="text-lg font-bold text-stone-800">
            {latestDate ? latestDate.toLocaleDateString() : "No dated records"}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            {totalPhones.toLocaleString()} entries include phone numbers
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-stone-200 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search watchlist entries..."
              className="w-full rounded-lg border-2 border-stone-200 py-2 pl-10 pr-4 focus:border-amber-600 focus:outline-none"
            />
          </div>

          <p className="text-sm text-stone-500">
            Showing {filteredEntries.length} of {entries.length} records
          </p>
        </div>

        {error && (
          <div className="mx-4 mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  Added
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-stone-500"
                  >
                    Loading watchlist entries...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-stone-500"
                  >
                    {searchTerm.trim()
                      ? "No watchlist entries match your search."
                      : "No watchlist entries found."}
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-t border-stone-100 transition hover:bg-stone-50"
                  >
                    <td className="px-6 py-4 align-top">
                      <p className="font-semibold text-stone-800">
                        {entry.name}
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-stone-600">
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-amber-600" />
                          <span>{entry.email}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-orange-600" />
                          <span>{entry.phone}</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                          entry.status
                        )}`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-stone-600">
                      <p className="font-medium text-stone-700">{entry.note}</p>
                      {entry.additionalFields.length > 0 && (
                        <p className="mt-2 text-xs text-stone-500">
                          {entry.additionalFields.join(" | ")}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-stone-600">
                      {formatDate(entry.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
