import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar.admin";
import Headerbar from "../components/admin/Headerbar.admin";

const LayoutAdmin = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex-col">
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
