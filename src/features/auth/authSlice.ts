import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: "user" | "admin";
  createdAt?: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

const storedToken = localStorage.getItem("authToken");
const storedUser = localStorage.getItem("authUser");

let parsedUser: AuthUser | null = null;

try {
  if (storedUser && storedUser !== "undefined") {
    parsedUser = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Failed to parse authUser:", error);
  localStorage.removeItem("authUser");
}

const initialState: AuthState = {
  token: storedToken,
  user: parsedUser,
};

const persistSession = (token: string, user: AuthUser) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("authUser", JSON.stringify(user));
  localStorage.setItem("userEmail", user.email);
};

const clearSession = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      persistSession(action.payload.token, action.payload.user);
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      if (state.token) persistSession(state.token, action.payload);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      clearSession();
    },
  },
});

export const { logout, setCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
