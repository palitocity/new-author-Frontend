import { createBrowserRouter } from "react-router-dom";

import Landingpage from "../Page/Landingpage";
import About from "../Page/About";
import Home from "../Page/Home";
import Blog from "../Page/Blog";
import Marketplace from "../Page/marketplace";
import { TermsAndConditions } from "../Page/Terms";
import Privacy from "../Page/privacy";
import Contact from "../Page/contact";
import Login from "../Auth/login";
import Signup from "../Auth/signup";
import AdminLogin from "../Auth/AdminLogin";
import ForgotPassword from "../Auth/ForgotPassword";
import ResetPassword from "../Auth/ResetPassword";
import Adminlayout from "../layout/adminlayout";
import Main from "../Admin/main";
import BlogUpload from "../Admin/blog";
import StoryUpload from "../Admin/stories";
import AllBlogs from "../Admin/viewblogs";
import Users from "../Admin/users";
import Orders from "../Admin/orders";
import Newsletter from "../Admin/newsletter";
import Settings from "../Admin/settings";
import ViewStories from "../Admin/viewstories";
import Picturgallary from "../Page/Picturgallary";
import UploadGallery from "../Admin/uploadgallary";
import StorybyId from "../Page/StorybyId";
import BlogbyId from "../Page/BlogbyId";
import OrderPage from "../Page/Orderpage";
import VerifyPayment from "../Page/Verifypayment";
import Watchlist from "../Admin/waitlist";
import Library from "../Page/Library";
import MediaPage from "../Admin/media";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardOverview from "../Page/dashboard/DashboardOverview";
import MyLibrary from "../Page/dashboard/MyLibrary";
import PurchaseHistory from "../Page/dashboard/PurchaseHistory";
import SavedStories from "../Page/dashboard/SavedStories";
import ProfileSettings from "../Page/dashboard/ProfileSettings";
import Security from "../Page/dashboard/Security";
import ProductDetailsPage from "../Page/ProductDetailsPage";
import ReaderPage from "../Page/ReaderPage";
import ReflectionNotesPage from "../Page/dashboard/ReflectionNotesPage";
import BookmarksPage from "../Page/dashboard/BookmarksPage";
import AccountPage from "../Page/dashboard/AccountPage";
import CheckoutPage from "../Page/checkout/CheckoutPage";
import PaymentPendingPage from "../Page/checkout/PaymentPendingPage";
import PaymentSuccessPage from "../Page/checkout/PaymentSuccessPage";
import PurchaseConfirmationPage from "../Page/checkout/PurchaseConfirmationPage";
import AccessDeniedPage from "../Page/security/AccessDeniedPage";
import SessionExpiredPage from "../Page/security/SessionExpiredPage";
import RestrictedContentPage from "../Page/security/RestrictedContentPage";
import ContinuityAdminPage from "../Admin/ContinuityAdminPage";

import VerifyEmail from "../Auth/verifyemail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landingpage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "gallery",
        element: <Picturgallary />,
      },
      {
        path: "terms",
        element: <TermsAndConditions />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "blog/:id",
        element: <BlogbyId />,
      },

      {
        path: "order/:id",
        element: <OrderPage />,
      },
      {
        path: "verify",
        element: <VerifyPayment />,
      },
      {
        path: "library",
        element: <Library />,
      },
      {
        path: "library/:productId",
        element: <ProductDetailsPage />,
      },
    ],
  },
  {
    path: "reader/:productId",
    element: <ReaderPage />,
  },
  {
    path: "checkout/:productId",
    element: <CheckoutPage />,
  },
  {
    path: "checkout/:productId/pending",
    element: <PaymentPendingPage />,
  },
  {
    path: "checkout/:productId/success",
    element: <PaymentSuccessPage />,
  },
  {
    path: "checkout/:productId/confirmation",
    element: <PurchaseConfirmationPage />,
  },
  {
    path: "access-denied",
    element: <AccessDeniedPage />,
  },
  {
    path: "session-expired",
    element: <SessionExpiredPage />,
  },
  {
    path: "restricted-content",
    element: <RestrictedContentPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path : 'verify-email',
    element: <VerifyEmail/>
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
  {
    path: "admin/login",
    element: <AdminLogin />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <DashboardOverview />,
          },
          {
            path: "marketplace",
            element: <Marketplace />,
          },
          {
            path: "library",
            element: <MyLibrary />,
          },
          {
            path: "reflection-notes",
            element: <ReflectionNotesPage />,
          },
          {
            path: "bookmarks",
            element: <BookmarksPage />,
          },
          {
            path: "story/:id",
            element: <StorybyId />,
          },
          {
            path: "purchases",
            element: <PurchaseHistory />,
          },
          {
            path: "saved",
            element: <SavedStories />,
          },
          {
            path: "profile",
            element: <ProfileSettings />,
          },
          {
            path: "security",
            element: <Security />,
          },
          {
            path: "account",
            element: <AccountPage />,
          },
        ],
      },
    ],
  },
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        path: "admin",
        element: <Adminlayout />,
        children: [
          {
            path: "main",
            element: <Main />,
          },
          {
            path: "blog",
            element: <BlogUpload />,
          },
          {
            path: "stories",
            element: <StoryUpload />,
          },
          {
            path: "view-blogs",
            element: <AllBlogs />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "newsletter",
            element: <Newsletter />,
          },
          {
            path: "watchlist",
            element: <Watchlist />,
          },
          {
            path: "waitlist",
            element: <Watchlist />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "view-stories",
            element: <ViewStories />,
          },
          {
            path: "upload",
            element: <UploadGallery />,
          },
          {
            path: "media",
            element: <MediaPage />,
          },
          {
            path: "products",
            element: <ContinuityAdminPage section="products" />,
          },
          {
            path: "purchases",
            element: <ContinuityAdminPage section="purchases" />,
          },
          {
            path: "subscriptions",
            element: <ContinuityAdminPage section="subscriptions" />,
          },
          {
            path: "access",
            element: <ContinuityAdminPage section="access" />,
          },
          {
            path: "content",
            element: <ContinuityAdminPage section="content" />,
          },
        ],
      },
    ],
  },
]);
