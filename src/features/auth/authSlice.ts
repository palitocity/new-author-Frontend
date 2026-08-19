/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* =========================================================
   USER TYPE USED THROUGHOUT THE FRONTEND
========================================================= */

export type AuthUser = {
  data: any;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: "user" | "admin";
  createdAt?: string;
};

/* =========================================================
   PROFILE RESPONSE
   This represents the BACKEND response:

   {
     success: true,
     data: {
       _id: "...",
       firstName: "Daniel",
       lastName: "Benevolent",
       email: "...",
       role: "user"
     }
   }
========================================================= */

export type ProfileResponse = {
  success: boolean;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    bio?: string;
    role?: "user" | "admin";
    createdAt?: string;
    __v?: number;
  };
  message?: string;
};

/* =========================================================
   AUTH STATE
========================================================= */

type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

/* =========================================================
   GET STORED SESSION
========================================================= */

const storedToken = localStorage.getItem("authToken");
const storedUser = localStorage.getItem("authUser");

let parsedUser: AuthUser | null = null;

/* =========================================================
   SAFELY PARSE STORED USER
========================================================= */

try {
  if (
    storedUser &&
    storedUser !== "undefined" &&
    storedUser !== "null"
  ) {
    const parsed = JSON.parse(storedUser);

    /*
      Make sure we don't put an invalid object into Redux.
      This protects against the "{}" problem.
    */

    if (
      parsed &&
      typeof parsed === "object" &&
      parsed._id &&
      parsed.firstName &&
      parsed.lastName &&
      parsed.email
    ) {
      parsedUser = parsed as AuthUser;
    } else {
      console.warn(
        "Invalid authUser found in localStorage. Removing it."
      );

      localStorage.removeItem("authUser");
    }
  }
} catch (error) {
  console.error(
    "Failed to parse authUser:",
    error
  );

  localStorage.removeItem("authUser");
}

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState: AuthState = {
  token: storedToken,
  user: parsedUser,
};

/* =========================================================
   PERSIST SESSION
========================================================= */

const persistSession = (
  token: string,
  user: AuthUser
) => {
  localStorage.setItem(
    "authToken",
    token
  );

  localStorage.setItem(
    "authUser",
    JSON.stringify(user)
  );

  localStorage.setItem(
    "userEmail",
    user.email
  );
};

/* =========================================================
   CLEAR SESSION
========================================================= */

const clearSession = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  localStorage.removeItem("userEmail");
};

/* =========================================================
   AUTH SLICE
========================================================= */

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    /* =====================================================
       LOGIN / SET CREDENTIALS
    ===================================================== */

    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: AuthUser;
      }>
    ) => {
      const { token, user } = action.payload;

      /*
        Don't allow an empty user object to enter Redux.
      */

      if (
        !user ||
        !user._id ||
        !user.firstName ||
        !user.lastName ||
        !user.email
      ) {
        console.error(
          "Invalid user supplied to setCredentials:",
          user
        );

        return;
      }

      state.token = token;
      state.user = user;

      persistSession(token, user);
    },

    /* =====================================================
       UPDATE USER
    ===================================================== */

    setUser: (
      state,
      action: PayloadAction<AuthUser>
    ) => {
      const user = action.payload;

      /*
        Prevent invalid/empty users from being stored.
      */

      if (
        !user ||
        !user._id ||
        !user.firstName ||
        !user.lastName ||
        !user.email
      ) {
        console.error(
          "Invalid user supplied to setUser:",
          user
        );

        return;
      }

      state.user = user;

      if (state.token) {
        persistSession(
          state.token,
          user
        );
      }
    },

    /* =====================================================
       LOGOUT
    ===================================================== */

    logout: (state) => {
      state.token = null;
      state.user = null;

      clearSession();
    },
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  logout,
  setCredentials,
  setUser,
} = authSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default authSlice.reducer;