import type { RouteObject } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import HomePage from "../pages/HomePage";
import UsersPage from "../pages/UsersPage";
import OrdersPage from "../pages/OrdersPage";
import ProductsPage from "../pages/ProductsPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> }, // "/"
      { path: "users", element: <UsersPage /> }, // "/usuarios"
      { path: "settings", element: <SettingsPage /> }, // "/ajustes"
      { path: "products", element: <ProductsPage /> }, // "/productos"
      { path: "orders", element: <OrdersPage /> }, // "/pedidos"
    ],
  },
  { path: "*", element: <NotFoundPage /> },
];
