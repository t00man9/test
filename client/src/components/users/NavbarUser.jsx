import React, { useState, useEffect } from "react";
import Logo from "../../assets/img/Logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useTigetStore from "../../store/tiget.store";
import { getUsers } from "../../api/auth";

const NavbarUser = () => {
  const token = useTigetStore((state) => state.token);
  const userInfo = useTigetStore((s) => s.numberCall);
  const role = useTigetStore((s) => s.role);
  const logout = useTigetStore((state) => state.logout);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          // เรียก API ดึงข้อมูลผู้ใช้โดยใช้ token
          const response = await getUsers({ token }); // สมมติว่า getUsers รองรับการส่ง token
          console.log("response", response);

          // หาก response.data เป็น Array
          const user = response.data.find((u) => u.numberCall);
          console.log("user", user);

          if (user) {
            setUserData(user); // บันทึกข้อมูลผู้ใช้ใน state
          }
          console.log("userData", userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);
  const handleLogout = () => {
    logout(); // ลบ token ออกจาก Zustand store
    navigate("/"); // ส่งผู้ใช้ไปที่หน้าแรกโดยใช้ React Router
  };
  return (
    <nav className="nav">
      <div className="sm:w-full md:w=[50rem] lg:w-[50rem] mx-auto ">
        <div className="flex justify-between flex-col sm:flex-col md:flax-row lg:flex-row h-32 md:h-16 lg:h-16 py-2 items-center">
          <Link to="/user" alt="LogoTiget">
            <img src={Logo} alt="" />
          </Link>
          <ul className="meuns flex items-center">
            {token ? (
              <>
                {role === "admin" ? (
                  <li className="ml-7 p-1 px-3 py-3 rounded-lg border-blue-600 bg-white text-black drop-shadow-lg">
                    <Link href="#">{userData?.credit ?? 0} ฿</Link>
                  </li>
                ) : (
                  <li className="ml-7 p-1 px-3 py-3 rounded-lg border-blue-600 bg-white text-black drop-shadow-lg">
                    <Link href="#">{userData?.credit ?? 0} ฿</Link>
                  </li>
                )}
              </>
            ) : (
              ""
            )}
            {token ? (
              <li className="ml-7 p-1 px-3 py-3 rounded-lg bg-yellow-300 text-white drop-shadow-lg">
                <Link to="addcredit" href="#">
                  เติมเงิน
                </Link>
              </li>
            ) : (
              ""
            )}
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

export default NavbarUser;
