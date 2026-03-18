import AuthBackground from "@/components/ui/bg-auth";
import { isAuthRoute } from "@/routes/routes";
import { Outlet, useLocation } from "react-router-dom";

const BaseLayout = () => {
  const { pathname } = useLocation();
  const showAuthBackground = isAuthRoute(pathname);

  return (
    <>
      <div className="relative flex flex-col w-full h-auto min-h-svh overflow-hidden">
        {showAuthBackground && (
          <div className="absolute inset-0 pointer-events-none">
            <AuthBackground />
          </div>
        )}

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="w-full mx-auto h-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default BaseLayout;
