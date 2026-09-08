/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import type { AuthUser } from "../features/auth/authSlice";

export type ContentType = "Book" | "Story";
export type PaymentStatus = "Paid" | "Pending" | "Failed";

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};


export type VerifyEmailRequest = {
  email: string;
  otp: string;
};

export type VerifyEmailResponse = {
  success: boolean;
  message: string;
};

/* =========================================================
   BACKEND USER
========================================================= */

type BackendUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: "user" | "admin";
  avatar?: string;
  bio?: string;
  createdAt?: string;
};

/* =========================================================
   LOGIN BACKEND RESPONSE

   Backend returns:

   {
     success: true,
     message: "Welcome Daniel!",
     data: {
       user: {...},
       token: "..."
     }
   }
========================================================= */

type LoginBackendResponse = {
  success: boolean;
  message: string;
  data: {
    user: BackendUser;
    token: string;
  };
};

/* =========================================================
   PROFILE BACKEND RESPONSE

   Backend returns:

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

type ProfileBackendResponse = {
  success: boolean;
  data: BackendUser;
  message?: string;
};

/* =========================================================
   LOGIN RESPONSE USED BY FRONTEND
========================================================= */

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
};

/* =========================================================
   REGISTER RESPONSE
========================================================= */

export type RegisterResponse = {
  success: boolean;
  message: string;
  data?: {
    user?: BackendUser;
    token?: string;
  };
};

/* =========================================================
   PROFILE RESPONSE USED BY FRONTEND

   IMPORTANT:
   This is now AuthUser directly.

   So:

   profile.firstName

   NOT:

   profile.data.firstName
========================================================= */

export type ProfileResponse = AuthUser;

/* =========================================================
   NORMALIZE BACKEND USER

   Converts:

   _id

   into:

   id
========================================================= */

const normalizeUser = (user: BackendUser): AuthUser => {
  return {
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  bio: user.bio,
  createdAt: user.createdAt,
  data: undefined
};
};

/* =========================================================
   LIBRARY
========================================================= */

export type LibraryBook = {
  bookId: string;
  orderId: string;
  transactionId: string;
  paymentReference: string;
  purchasedAt: string;

  currentPage: number;
  totalPages: number;
  progressPercentage: number;
  lastReadAt?: string | null;

  bookSnapshot?: {
    bookId: string;
    title: string;
    subtitle?: string;
    author?: string;
    coverImage?: string;
    pdfFile?: string;
  };
};

export type LibraryResponse = {
  success: boolean;
  count: number;
  data: {
    userId: string;
    books: LibraryBook[];
  };
};

/* =========================================================
   ORDERS
========================================================= */

export type OrderItem = {
  status: any;

  book: {
    _id: string;
    title: string;
    author: string;
    coverImage?: string;
  } | null;

  quantity: number;
  priceAtPurchase: number;
  _id: string;
};

export type Order = {
  _id: string;
  paymentReference?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  paidAt?: string;
};

export type OrdersResponse = {
  success: boolean;
  count: number;
  data: Order[];
};

/* =========================================================
   SAVED STORIES
========================================================= */

export type SavedStory = {
  id: string;
  storyId: string;
  title: string;
  category: string;
  image?: string;
  dateSaved: string;
};

/* =========================================================
   DASHBOARD
========================================================= */

export type DashboardStats = {
  totalBooksPurchased: number;
  totalStoriesPurchased: number;
  totalAmountSpent: number;
  savedStoriesCount: number;
};

export type DashboardActivity = {
  recentlyPurchasedBooks: LibraryResponse[];
  recentPayments: OrderItem[];
};

/* =========================================================
   API BASE URL
========================================================= */

const baseUrl =
  import.meta.env.VITE_DEVE_URL ||
  "https://api.sankofaseek.com/api";

/* =========================================================
   API
========================================================= */

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl,

    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;

      const token =
        state.auth?.token ||
        localStorage.getItem("authToken");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: [
    "Me",
    "Library",
    "Payments",
    "SavedStories",
    "Profile",
  ],

  endpoints: (builder) => ({
    /* =====================================================
       REGISTER
    ===================================================== */

    register: builder.mutation<
      RegisterResponse,
      RegisterRequest
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    /* =====================================================
       VERIFY EMAIL
    ===================================================== */

    verifyEmail: builder.mutation<
      VerifyEmailResponse,
      VerifyEmailRequest
    >({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    /* =====================================================
       LOGIN
    ===================================================== */

    login: builder.mutation<
      LoginResponse,
      LoginRequest
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),

      transformResponse: (
        response: LoginBackendResponse
      ): LoginResponse => {
        return {
          success: response.success,
          message: response.message,

          data: {
            user: normalizeUser(response.data.user),
            token: response.data.token,
          },
        };
      },
    }),

    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    forgotPassword: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    /* =====================================================
       RESET PASSWORD
    ===================================================== */

    resetPassword: builder.mutation<
      { message: string },
      {
        token: string;
        password: string;
      }
    >({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: {
          token,
          password,
        },
      }),
    }),

    /* =====================================================
       CURRENT USER

       GET:
       /auth/profile

       Returns AuthUser directly.

       IMPORTANT:

       profile.firstName
       profile.lastName
       profile.email

       NOT profile.data.firstName
    ===================================================== */

    profile: builder.query<
      AuthUser,
      void
    >({
      query: () => "/auth/profile",

      transformResponse: (
        response: ProfileBackendResponse
      ): AuthUser => {
        return normalizeUser(response.data);
      },

      providesTags: ["Profile", "Me"],
    }),

    /* =====================================================
       LIBRARY
    ===================================================== */

    library: builder.query<
      LibraryResponse,
      void
    >({
      query: () => "/library/me",
      providesTags: ["Library"],
    }),

    /* =====================================================
       LIBRARY ITEM
    ===================================================== */

    libraryItem: builder.query<
      LibraryResponse,
      string
    >({
      query: (id) => `/library/${id}`,
      providesTags: ["Library"],
    }),

    /* =====================================================
       PAYMENT HISTORY
    ===================================================== */

    paymentHistory: builder.query<
      OrdersResponse,
      void
    >({
      query: () => "/order/me",
      providesTags: ["Payments"],
    }),

    /* =====================================================
       SAVED STORIES
    ===================================================== */

    savedStories: builder.query<
      SavedStory[],
      void
    >({
      query: () => "/saved-stories",
      providesTags: ["SavedStories"],
    }),

    /* =====================================================
       SAVE STORY
    ===================================================== */

    saveStory: builder.mutation<
      SavedStory,
      string
    >({
      query: (storyId) => ({
        url: `/saved-stories/${storyId}`,
        method: "POST",
      }),

      invalidatesTags: ["SavedStories"],
    }),

    /* =====================================================
       REMOVE SAVED STORY
    ===================================================== */

    removeSavedStory: builder.mutation<
      { message: string },
      string
    >({
      query: (storyId) => ({
        url: `/saved-stories/${storyId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["SavedStories"],
    }),

    /* =====================================================
       UPDATE PROFILE
    ===================================================== */

    updateProfile: builder.mutation<
      AuthUser,
      FormData
    >({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body,
      }),

      invalidatesTags: [
        "Me",
        "Profile",
      ],
    }),

    /* =====================================================
       CHANGE PASSWORD
    ===================================================== */

    changePassword: builder.mutation<
      { message: string },
      {
        currentPassword: string;
        newPassword: string;
      }
    >({
      query: (body) => ({
        url: "/profile/password",
        method: "PUT",
        body,
      }),
    }),

    /* =====================================================
       DASHBOARD STATS
    ===================================================== */

    dashboardStats: builder.query<
      DashboardStats,
      void
    >({
      query: () => "/dashboard/stats",
    }),

    /* =====================================================
       DASHBOARD ACTIVITY
    ===================================================== */

    dashboardActivity: builder.query<
      DashboardActivity,
      void
    >({
      query: () => "/dashboard/activity",
    }),

    /* =====================================================
       SAVE READING PROGRESS
    ===================================================== */

    saveReadingProgress: builder.mutation<
      {
        success: boolean;
        message: string;

        data: {
          bookId: string;
          currentPage: number;
          totalPages: number;
          progressPercentage: number;
          lastReadAt: string;
        };
      },
      {
        bookId: string;
        currentPage: number;
        totalPages: number;
      }
    >({
      query: ({
        bookId,
        currentPage,
        totalPages,
      }) => ({
        url: `/library/${bookId}/progress`,
        method: "PATCH",
        body: {
          currentPage,
          totalPages,
        },
      }),

      invalidatesTags: ["Library"],
    }),
  }),
});



/* =========================================================
   HOOKS
========================================================= */

export const {
  useChangePasswordMutation,
  useDashboardActivityQuery,
  useDashboardStatsQuery,
  useForgotPasswordMutation,
  useLibraryQuery,
  useLoginMutation,
  usePaymentHistoryQuery,
  useProfileQuery,
  useRegisterMutation,
  useRemoveSavedStoryMutation,
  useResetPasswordMutation,
  useSaveReadingProgressMutation,
  useSaveStoryMutation,
  useSavedStoriesQuery,
  useUpdateProfileMutation,
   useVerifyEmailMutation,
} = api;