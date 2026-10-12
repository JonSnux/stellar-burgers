import { getIsAuthCheckedSelector, getUserSelector } from "@/services/slices/user-slice";
import { useSelector } from "@/services/store";
import { Preloader } from "@krgaa/react-developer-burger-ui-components";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  unAuth?: boolean;
  children: ReactNode;
}

export function ProtectedRoute({ unAuth, children }: ProtectedRouteProps) {
  const user = useSelector(getUserSelector);
  const authChecked = useSelector(getIsAuthCheckedSelector);
  const location = useLocation();
  const state = location.state as { from?: string } | null;
  const from = state?.from ?? '/';
  
  if (!authChecked) {
    return <Preloader />;
  }
  if (!unAuth && !user) {
    return <Navigate to="/login" state={{from: location}} replace />
  }
  if (unAuth && user) {
    return <Navigate to={from} replace />
  }
  return children;
}