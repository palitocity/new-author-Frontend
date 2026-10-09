import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useNoIndex } from "../../seo/usePageMeta";
import { clearAdminSession, isTokenValid } from "../../utils/session";

export default function AdminProtectedRoute() {
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");

  useNoIndex("Admin | SankofaSeek");

  if (!isTokenValid(adminToken, "admin")) {
    if (adminToken) clearAdminSession();

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
