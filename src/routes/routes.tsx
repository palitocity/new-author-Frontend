import { createBrowserRouter } from "react-router-dom";

import Landingpage from "../Page/Landingpage";
import About from "../Page/About";
import Home from "../Page/Home";
import Blog from "../Page/Blog";
import Marketplace from "../Page/marketplace";
import { TermsAndConditions } from "../Page/Terms";
import Privacy from "../Page/privacy";
import Contact from "../Page/contact";

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
    ],
  },
]);
