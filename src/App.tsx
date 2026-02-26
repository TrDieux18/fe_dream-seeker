import { useEffect } from "react";
import "./App.css";
import { useAuth } from "@/hooks/use-auth";
import AppRoutes from "@/routes";
import Logo from "@/components/logo";
import { Spinner } from "@/components/ui/spinner";
import { useLocation } from "react-router-dom";
import { isAuthRoute } from "@/routes/routes";
import { useSocket } from "@/hooks/use-socket";

function App() {
  const { pathname } = useLocation();

  const { user, isAuthStatus, isAuthStatusLoading } = useAuth();

  useSocket();

  const isAuth = isAuthRoute(pathname);

  useEffect(() => {
    if (isAuth) return;
    isAuthStatus();
  }, [isAuthStatus, isAuth]);

  if (isAuthStatusLoading && !user && !isAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Logo imgClass="size-[20px]" showText={false} />
        <Spinner className="h-6 w-6" />
      </div>
    );
  }
  return <AppRoutes />;
}

export default App;
