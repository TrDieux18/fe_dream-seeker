import { useAuth } from "@/hooks/use-auth";
import { PROTECTED_ROUTES } from "@/routes/routes";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface RouteGuardProps {
  requireAuth?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ requireAuth }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isProfileComplete = Boolean(
    user?.name?.trim() && user?.username?.trim() && user?.avatar?.trim(),
  );
  const isOnCompleteProfileRoute =
    location.pathname === PROTECTED_ROUTES.COMPLETE_PROFILE;

  if (requireAuth && !user) {
    return <Navigate to="/" replace />;
  }

  if (requireAuth && user) {
    if (isProfileComplete && isOnCompleteProfileRoute) {
      return <Navigate to={PROTECTED_ROUTES.FEED} replace />;
    }
  }

  if (!requireAuth && user) {
    return (
      <Navigate
        to={
          isProfileComplete
            ? PROTECTED_ROUTES.FEED
            : PROTECTED_ROUTES.COMPLETE_PROFILE
        }
        replace
      />
    );
  }

  return <Outlet />;
};

export default RouteGuard;
