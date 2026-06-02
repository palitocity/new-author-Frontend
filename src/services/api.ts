/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import type { AuthUser, ProfileResponse } from "../features/auth/authSlice";

export type ContentType = "Book" | "Story";
export type PaymentStatus = "Successful" | "Pending" | "Failed";

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

export type AuthResponse = {
  data: any;
  message: string;
  token: string;
  user: AuthUser;
};

export type LibraryItem = {
  id: string;
  contentId: string;
  title: string;
  author: string;
  coverImage?: string;
  purchaseDate: string;
  contentType: ContentType;
};

export type Purchase = {
  id: string;
  transactionReference: string;
  itemPurchased: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: PaymentStatus;
};

export type SavedStory = {
  id: string;
  storyId: string;
  title: string;
  category: string;
  image?: string;
  dateSaved: string;
};

export type DashboardStats = {
  totalBooksPurchased: number;
  totalStoriesPurchased: number;
  totalAmountSpent: number;
  savedStoriesCount: number;
};

export type DashboardActivity = {
  recentlyPurchasedBooks: LibraryItem[];
  recentlyReadStories: LibraryItem[];
  recentPayments: Purchase[];
};

const baseUrl = import.meta.env.VITE_DEVE_URL || "/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState as () => RootState)()?.auth?.token ||
        localStorage.getItem("authToken");

      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Me", "Library", "Payments", "SavedStories", "Profile"],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),
    me: builder.query<AuthUser, void>({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
    library: builder.query<LibraryItem[], void>({
      query: () => "/library/me",
      providesTags: ["Library"],
    }),
    libraryItem: builder.query<LibraryItem, string>({
      query: (id) => `/library/${id}`,
      providesTags: ["Library"],
    }),
    paymentHistory: builder.query<Purchase[], void>({
      query: () => "/payments/history",
      providesTags: ["Payments"],
    }),
    savedStories: builder.query<SavedStory[], void>({
      query: () => "/saved-stories",
      providesTags: ["SavedStories"],
    }),
    saveStory: builder.mutation<SavedStory, string>({
      query: (storyId) => ({
        url: `/saved-stories/${storyId}`,
        method: "POST",
      }),
      invalidatesTags: ["SavedStories"],
    }),
    removeSavedStory: builder.mutation<{ message: string }, string>({
      query: (storyId) => ({
        url: `/saved-stories/${storyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedStories"],
    }),
    profile: builder.query<ProfileResponse, void>({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<AuthUser, FormData>({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Me", "Profile"],
    }),
    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({ url: "/profile/password", method: "PUT", body }),
    }),
    dashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
    }),
    dashboardActivity: builder.query<DashboardActivity, void>({
      query: () => "/dashboard/activity",
    }),
  }),
});

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
  useSaveStoryMutation,
  useSavedStoriesQuery,
  useUpdateProfileMutation,
} = api;
