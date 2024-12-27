import React from "react";
import { NavLink } from "react-router-dom";
import {
  Gauge,
  House,
  UserPen,
  Trophy,
  CalendarClock,
  LogOut,UserCog 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useTigetStore from "../../store/tiget.store";

const Sidebar = () => {
  const logout = useTigetStore((state) => state.logout);
  const role = useTigetStore((state) => state.role);

  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // ลบ token ออกจาก Zustand store
    navigate("/"); // ส่งผู้ใช้ไปที่หน้าแรกโดยใช้ React Router
  };
  return (
    <div className="bg-slate-500 w-64 text-gray-100 flex flex-col h-screen">
      <div className="h-24 bg-slate-600 flex items-center justify-center text-2xl font-bold">
        <h2>ระบบจัดการแอดมิน</h2>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavLink
          end
          className={({ isActive }) =>
            isActive
              ? "p-1  bg-gray-500 text-white drop-shadow-lg  px-4 py-2  flex items-center rounded-md"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <UserCog className="mr-2" />
           {role}
        </NavLink>
        <NavLink
          to={"/admin"}
          end
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900  px-4 py-2  flex items-center rounded-md"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <Gauge className="mr-2" />
          DashBoard
        </NavLink>
        <NavLink
          to={"manage"}
          end
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900   px-4 py-2  flex items-center rounded-md"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <UserPen className="mr-2" />
          จัดการสมาชิก
        </NavLink>
        <NavLink
          to={"payout"}
          end
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900   px-4 py-2  flex items-center rounded-md"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <Trophy className="mr-2" />
          ผลรางวัล
        </NavLink>
        <NavLink
          to={"loto"}
          end
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900   px-4 py-2  flex items-center rounded-md"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <CalendarClock className="mr-2" />
          เปิดรอบหวย
        </NavLink>
        <NavLink
          to={"/user"}
          end
          className={({ isActive }) =>
            isActive
              ? "bg-gray-900   px-4 py-2  flex items-center rounded-md"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <House className="mr-2" />
          หน้าหลัก
        </NavLink>
        <NavLink
          onClick={handleLogout}
          end
          className={({ isActive }) =>
            isActive
              ? "p-1  bg-white text-red-700 drop-shadow-lg  px-4 py-2  flex items-center rounded-md"
              : "text-gray-400 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
          }
        >
          <LogOut className="mr-2" />
          ออกจากระบบ
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
