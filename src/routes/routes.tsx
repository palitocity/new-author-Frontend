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
        path: "TERRÆ & ETHEREA Altar",
        element: <Picturgallary />,
      },
      {
        path: "marketplace",
        element: <Marketplace />,
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
        path: "story/:id",
        element: <StorybyId />,
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
    ],
  },
]);
