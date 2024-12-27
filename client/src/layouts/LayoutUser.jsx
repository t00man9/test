import React from "react";
import { Outlet } from "react-router-dom";
import NavbarUser from "../components/users/NavbarUser";

const LayoutUser = () => {
  return (
    <div>
      {/* ส่วน Navbar */}
      <NavbarUser />
      {/* เนื้อหาสำหรับ Outlet */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutUser;
