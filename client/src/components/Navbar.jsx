import React from "react";
import Logo from "../assets/img/Logo.png";
import { Link, useNavigate } from "react-router-dom";

import useTigetStore from "../store/tiget.store";

const Navbar = () => {
  const token = useTigetStore((state) => state.token);
  const logout = useTigetStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // ลบ token ออกจาก Zustand store
    navigate("/"); // ส่งผู้ใช้ไปที่หน้าแรกโดยใช้ React Router
  };

  return (
    <nav>
      <div className="sm:w-full md:w=[50rem] lg:w-[50rem] mx-auto">
        <div className="flex justify-between flex-col sm:flex-col md:flax-row lg:flex-row h-32 md:h-16 lg:h-16 py-2 items-center">
          <Link to="/" alt="LogoTiget">
            <img src={Logo} alt="" />
          </Link>
          <ul className="meuns flex items-center">
            <li className="ml-7">
              <Link to="checkout">ผลรางวัล</Link>
            </li>
            <li className="ml-7">
              <Link to="login" href="#">
                ติดต่อแอดมิน
              </Link>
            </li>
            {token ? (
              <li className="ml-7">
                <button
                  className="p-1 px-3 py-3 rounded-lg bg-white text-red-700 drop-shadow-lg"
                  onClick={handleLogout}
                >
                  ออกจากระบบ
                </button>
              </li>
            ) : (
              <li className="ml-7">
                <Link
                  className="p-1 px-3 py-3 rounded-lg bg-white drop-shadow-lg"
                  to="/result"
                >
                  ผลรางวัล
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
