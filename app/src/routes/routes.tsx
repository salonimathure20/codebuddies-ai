import { createBrowserRouter, Navigate, Outlet } from "react-router";
import App from "../App";

import { SignUp } from "pages/SignUp";
import { Login } from "pages/Login";
import { Dashboard } from "pages/Dashboard";
import { LiveCoder } from "pages/LiveCoder";
import { SessionQueue } from "pages/SessionQueue";
import SessionScreen from "pages/SessionScreen";

import SubscriptionPage from "pages/SubscriptionPage";
import { SessionRequests } from "pages/SessionRequests";
import { LandingPage } from "pages/LandingPage";
import { ProfileForm } from "pages/UserProfile";
import { AccountSettings } from "pages/AccountSettings";
import { useAuth } from "hooks/use-auth";
import Payment from "pages/Payments";
import Completion from "pages/Completion";

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/landing",
        Component: LandingPage,
      },
      {
        path: "/sign-up",
        Component: SignUp,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/dashboard",
        Component: PrivateRoute,
        children: [{ path: "/dashboard", Component: Dashboard }],
      },
      {
        path: "/live-coder",
        Component: PrivateRoute,
        children: [{ path: "/live-coder", Component: LiveCoder }],
      },
      {
        path: "/queue",
        Component: PrivateRoute,
        children: [{ path: "/queue", Component: SessionQueue }],
      },
      {
        path: "/video-call",
        Component: PrivateRoute,
        children: [{ path: "/video-call", Component: SessionScreen }],
      },
      {
        path: "/session-requests",
        Component: PrivateRoute,
        children: [{ path: "/session-requests", Component: SessionRequests }],
      },
      {
        path: "/payments",
        Component: PrivateRoute,
        children: [{ path: "/payments", Component: SubscriptionPage }],
      },
      {
        path: "/profile",
        Component: PrivateRoute,
        children: [{ path: "/profile", Component: ProfileForm }],
      },
      {
        path: "/settings",
        Component: PrivateRoute,
        children: [{ path: "/settings", Component: AccountSettings }],
      },
      {
        path: "/payment",
        Component: PrivateRoute,
        children: [{ path: "/payment", Component: Payment }],
      },
      {
        path: "/completion",
        Component: PrivateRoute,
        children: [{ path: "/completion", Component: Completion }],
      },
    ],
  },
]);
