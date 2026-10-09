type JwtPayload = {
  id?: string;
  type?: string;
  exp?: number;
};

/**
 * Reads a JWT payload without verifying it. Only used for client-side UX
 * (redirect before an expired session hits the API); the API still verifies
 * every token.
 */
export const decodeJwt = (token: string | null): JwtPayload | null => {
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
};

export const isTokenValid = (token: string | null, expectedType?: string) => {
  const payload = decodeJwt(token);
  if (!payload) return false;

  if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
    return false;
  }

  if (expectedType && (payload.type || "user") !== expectedType) {
    return false;
  }

  return true;
};

export const clearUserSession = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  localStorage.removeItem("userEmail");
};

export const clearAdminSession = () => {
  localStorage.removeItem("adminToken");
};
