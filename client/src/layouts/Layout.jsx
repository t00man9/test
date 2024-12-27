import React from "react";
import { Outlet } from "react-router-dom";
import NavbarUser from "../components/users/NavbarUser";

const Layout = () => {
  return (
    <div>
      <NavbarUser />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
