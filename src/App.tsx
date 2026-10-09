import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import SessionManager from "./components/auth/SessionManager";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <SessionManager />
    </>
  );
};

export default App;
