import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AdminProtectedRoute() {
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
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
