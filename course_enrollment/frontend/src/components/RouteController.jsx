import { Navigate, useLocation } from "react-router-dom";

export function AuthRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export function RoleRoute({ children, allowRoles }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user || !allowRoles.includes(user.userRole?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function GuestRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user) return <Navigate to="/" replace />;
  return children;
}

export function ResetPasswordRoute({ children }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}
