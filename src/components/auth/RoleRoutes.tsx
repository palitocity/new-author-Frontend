import { Navigate, Outlet, useLocation } from "react-router-dom";
import AccessDenied from "../access/AccessDenied";
import { mockCurrentAccess } from "../../data/mockContinuity";
import { useAppSelector } from "../../store/hooks";
import { UserRole } from "../../types/user";

const roleRank: Record<UserRole, number> = {
  [UserRole.Visitor]: 0,
  [UserRole.RegisteredUser]: 1,
  [UserRole.ProductBuyer]: 2,
  [UserRole.Member]: 3,
  [UserRole.Steward]: 4,
  [UserRole.Admin]: 5,
};

const useEffectiveRole = () => {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  if (user?.role === "admin") return UserRole.Admin;
  if (token) return mockCurrentAccess.role;
  return UserRole.Visitor;
};

function RequireRole({ minimumRole }: { minimumRole: UserRole }) {
  const role = useEffectiveRole();

  if (roleRank[role] < roleRank[minimumRole]) {
    return <AccessDenied />;
  }

  return <Outlet />;
}

export function PublicRoute() {
  return <Outlet />;
}

export function AuthRoute() {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function BuyerRoute() {
  return <RequireRole minimumRole={UserRole.ProductBuyer} />;
}

export function MemberRoute() {
  return <RequireRole minimumRole={UserRole.Member} />;
}

export function StewardRoute() {
  return <RequireRole minimumRole={UserRole.Steward} />;
}

export function AdminRoute() {
  return <RequireRole minimumRole={UserRole.Admin} />;
}
