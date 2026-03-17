import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useActor } from "./hooks/useActor";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import DashboardPage from "./pages/DashboardPage";
import DriverLoginPage from "./pages/DriverLoginPage";
import DriversPage from "./pages/DriversPage";
import LandingPage from "./pages/LandingPage";
import LiveDriversPage from "./pages/LiveDriversPage";
import RegisterDriverPage from "./pages/RegisterDriverPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import TrackBookingPage from "./pages/TrackBookingPage";

const queryClient = new QueryClient();

function AppShell() {
  const { actor } = useActor();

  useEffect(() => {
    if (!actor) return;
    Promise.all([
      actor.seedDrivers().catch(() => {}),
      (actor as any).seedMoreDrivers?.().catch(() => {}),
      (actor as any).seedEvenMoreDrivers?.().catch(() => {}),
      (actor as any).seedFinalDrivers?.().catch(() => {}),
    ]);
  }, [actor]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const driversRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/drivers",
  component: DriversPage,
});

const liveDriversRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/live",
  component: LiveDriversPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/$driverId",
  component: BookingPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confirmation/$bookingId",
  component: ConfirmationPage,
});

const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track",
  component: TrackBookingPage,
});

const registerDriverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register-driver",
  component: RegisterDriverPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const subscriptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscriptions",
  component: SubscriptionsPage,
});

const driverLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/driver-login",
  component: DriverLoginPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  driversRoute,
  liveDriversRoute,
  bookingRoute,
  confirmationRoute,
  trackRoute,
  registerDriverRoute,
  dashboardRoute,
  subscriptionsRoute,
  driverLoginRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
