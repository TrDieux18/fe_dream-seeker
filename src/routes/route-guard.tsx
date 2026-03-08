import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";
interface RouteGuardProps {
  requireAuth?: boolean;
}
const RouteGuard: React.FC<RouteGuardProps> = ({ requireAuth }) => {
  const { user } = useAuth();

  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/feed" replace />;
  }
  return <Outlet />;
};

export default RouteGuard;
