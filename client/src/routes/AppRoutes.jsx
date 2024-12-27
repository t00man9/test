import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Checkout from "../pages/Checkout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Tiget from "../pages/user/Tiget";
import HomeUser from "../pages/user/HomeUser";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Billtotal from "../pages/admin/Billtotal";
import Dashboard from "../pages/admin/Dashboard";
import Manage from "../pages/admin/Manage";
import LayoutUser from "../layouts/LayoutUser";
import ProtectRooteUser from "./ProtectRooteUser";
import ProtectRooteAdmin from "./ProtectRouteAdmin";
import Payout from "../pages/admin/Payout";
import Loto from "../pages/admin/Loto";
import CheckTiget from "../pages/user/CheckTiget";
import NewTiget from "../pages/user/NewTiget";
import AddCredit from "../pages/user/AddCredit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "checkout", element: <Checkout /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectRooteAdmin element={<LayoutAdmin />} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "billtotal", element: <Billtotal /> },
      { path: "manage", element: <Manage /> },
      { path: "payout", element: <Payout /> },
      { path: "loto", element: <Loto /> },
    ],
  },
  {
    path: "/user",
    // element: <LayoutUser />,
    element: <ProtectRooteUser element={<LayoutUser />} />,
    children: [
      { index: true, element: <HomeUser /> },
      { path: "billtotal", element: <Billtotal /> },
      { path: "tiget", element: <Tiget /> },
      { path: "checktigetbetting", element: <CheckTiget /> },
      { path: "newtiget", element: <NewTiget /> },
      { path: "checkout", element: <Checkout /> },
      { path: "addcredit", element: <AddCredit /> },
    ],
  },
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
