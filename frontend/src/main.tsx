import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import ShopOwnerSignup from "./pages/ShopSignup";
import ShopOwnerLogin from "./pages/ShopLogin";
import MedicineSearch from "./pages/MedicineSearch";
import OrderTracking from "./pages/OrderTracking";
import UserProfile from "./pages/UserProfile";
import ShopDashboard from "./pages/ShopDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/user-signup",
        element: <UserSignup />,
      },
      {
        path: "/shop-signup",
        element: <ShopOwnerSignup />,
      },
      {
        path: "/user-login",
        element: <UserLogin />,
      },
      {
        path: "/shop-login",
        element: <ShopOwnerLogin />,
      },
      {
        path: "/medicine-search",
        element: <MedicineSearch />,
      },
      {
        path: "/orders",
        element: <OrderTracking />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/shop-dashboard",
        element: <ShopDashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);