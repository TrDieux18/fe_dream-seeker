import BaseLayout from "@/layouts/base-layout";
import { Route, Routes } from "react-router-dom";
import {
  authRoutesPaths,
  onboardingProtectedRoutesPaths,
  protectedRoutesPaths,
} from "./routes";
import AppLayout from "@/layouts/app-layout";
import RouteGuard from "@/routes/route-guard";

const AppRoutes = () => {
  return (
    <Routes>
   
      <Route path="/" element={<RouteGuard requireAuth={false} />}>
        <Route element={<BaseLayout />}>
          {authRoutesPaths?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      <Route path="/" element={<RouteGuard requireAuth={true} />}>
        <Route element={<BaseLayout />}>
          {onboardingProtectedRoutesPaths?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<AppLayout />}>
          {protectedRoutesPaths?.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
