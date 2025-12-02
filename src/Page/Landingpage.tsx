import { Outlet } from "react-router-dom";
import Footer from "../components/Mainfooter";
import Navbar from "../components/Header";

const Landingpage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-light text-primary">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Landingpage;
