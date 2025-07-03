import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { JSX } from "react";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or your custom loading spinner
  }

  if (!user) {
    // Redirect to login page, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}