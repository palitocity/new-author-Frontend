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
import LibraryReader from "../Page/Libraryreader";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardOverview from "../Page/dashboard/DashboardOverview";
import MyLibrary from "../Page/dashboard/MyLibrary";
import PurchaseHistory from "../Page/dashboard/PurchaseHistory";
import SavedStories from "../Page/dashboard/SavedStories";
import ProfileSettings from "../Page/dashboard/ProfileSettings";
import Security from "../Page/dashboard/Security";

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
        path: "story/:id",
        element: <StorybyId />,
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
        path: "library/:id",
        element: <LibraryReader />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
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
        ],
      },
    ],
  },
]);
