import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { useNoIndex } from "../../seo/usePageMeta";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { isTokenValid } from "../../utils/session";

export default function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const expired = Boolean(token) && !isTokenValid(token, "user");

  useNoIndex();

  useEffect(() => {
    if (expired) dispatch(logout());
  }, [expired, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (expired) {
    return (
      <Navigate to="/session-expired" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
