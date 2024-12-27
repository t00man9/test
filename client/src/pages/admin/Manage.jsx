import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  peadingTopUps,
  handleApprove,
  handleReject,
  getUsers,
  updateUserCredit,
} from "../../api/auth";
import useTigetStore from "../../store/tiget.store"; // ใช้ Zustand
import { toast } from "react-toastify";

const Manage = () => {
  const token = useTigetStore((s) => s.token);
  const role = useTigetStore((s) => s.role);

  const roles = ["master", "admin", "user"]; // Array ของหน้าที่
  // สร้างบัญชี
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    numberCall: "",
    password: "",
    role: roles[0], // ค่าเริ่มต้นของ role
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topUps, setTopUps] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State สำหรับการค้นหา

  useEffect(() => {
    // ดึงข้อมูลคำขอเติมเงินที่ยังค้างอยู่
    peadingTopUps()
      .then((response) => {
        // ตรวจสอบว่า response.data เป็น array หรือไม่
        if (Array.isArray(response.data)) {
          // 필터เฉพาะรายการที่มีสถานะเป็น PENDING เท่านั้น
          const pendingTopUps = response.data.filter(
            (topUp) => topUp.status === "PENDING"
          );
          setTopUps(pendingTopUps);
        } else {
          console.error("คำขอเติมเงินไม่เป็น array");
        }
      })
      .catch((error) => console.error("Error fetching topUps:", error)); // การจัดการข้อผิดพลาด
  }, []);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลผู้ใช้
    const fetchUsers = async () => {
      try {
        const response = await getUsers(token); // ปรับ URL ตาม backend ของคุณ
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        setLoading(false);
      }
    };
    fetchUsers();
  }, [users]);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>{error}</p>;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const filteredUsers = users.filter((user) =>
    user.numberCall.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if numberCall has exactly 10 digits
    try {
      const res = await axios.post("http://localhost:3001/api/register", form);
      const sucMsg = res.data;
      toast.success(sucMsg);
      setForm({});
      console.log(res);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
      console.log(err);
    }
    console.log(form);
  };

  const handleApproves = (topUpId) => {
    // 1. แสดง topUpId ที่ถูกส่งมาด้วยการล็อกข้อมูล
    console.log("topUpId", topUpId);

    // 2. เรียกฟังก์ชัน handleApprove เพื่อติดต่อ API
    handleApprove(token, topUpId)
      .then((response) => {
        // 3. เมื่อคำขอได้รับการอนุมัติสำเร็จ (response)
        console.log("response", response);

        // 4. แสดงข้อความจากเซิร์ฟเวอร์
        alert(response.data.message);

        // 5. อัปเดตข้อมูล topUps ใน state โดยการลบรายการที่ได้รับการอนุมัติแล้วออก
        setTopUps((prev) => prev.filter((topUp) => topUp.id !== topUpId));
      })
      .catch((error) => {
        console.log(error.message);
        // 6. หากเกิดข้อผิดพลาดในการอนุมัติคำขอ
        alert("เกิดข้อผิดพลาดในการอนุมัติคำขอ");
      });
  };

  const handleRejects = (topUpId) => {
    handleReject(token, topUpId)
      .then((response) => {
        // 3. เมื่อคำขอได้รับการอนุมัติสำเร็จ (response)
        console.log("response", response);

        // 4. แสดงข้อความจากเซิร์ฟเวอร์
        alert(response.data.message);

        // 5. อัปเดตข้อมูล topUps ใน state โดยการลบรายการที่ได้รับการอนุมัติแล้วออก
        setTopUps((prev) => prev.filter((topUp) => topUp.id !== topUpId));
      })
      .catch((error) => {
        console.log(error.message);
        // 6. หากเกิดข้อผิดพลาดในการอนุมัติคำขอ
        alert("เกิดข้อผิดพลาดในการอนุมัติคำขอ");
      });
  };

  const handleViewImage = (topUpId) => {
    const imageUrl = `http://localhost:3001/api/image/${topUpId}`;
    return <img src={imageUrl} alt="TopUp Image" />;
  };

  const handleEditCredit = (userId, newCredit) => {
    // ตรวจสอบว่า newCredit เป็นตัวเลข
    if (isNaN(newCredit) || newCredit < 0) {
      toast.error("กรุณากรอกเครดิตที่ถูกต้อง");
      return;
    }
    // เรียก API เพื่ออัปเดตเครดิต
    updateUserCredit(token, userId, newCredit)
      .then((response) => {
        toast.success("อัปเดตเครดิตสำเร็จ");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, credit: newCredit } : user
          )
        );
      })
      .catch((error) => {
        toast.error("เกิดข้อผิดพลาดในการอัปเดตเครดิต");
        console.error("Error updating credit:", error);
      });
  };

  return (
    <>
      <main className="mt-6 space-y-6 max-w-screen-lg mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            ระบบจัดการสมาชิก
          </h2>

          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-700">
              รายการคำขอเติมเงินที่ค้างอยู่
            </h1>

            {/* ตรวจสอบว่า topUps เป็น array ก่อนใช้ .map */}
            {Array.isArray(topUps) && topUps.length > 0 ? (
              <ul className="space-y-4">
                {topUps.map((topUp) => (
                  <li
                    key={topUp.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <p className="text-gray-600">
                      ผู้ใช้:{" "}
                      <span className="font-semibold text-gray-900">
                        {topUp.userId}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      จำนวนเงิน:{" "}
                      <span className="font-semibold text-gray-900">
                        {topUp.amount} บาท
                      </span>
                    </p>

                    {/* แสดงรูปถ้าหากมีไฟล์ */}
                    {/* ปุ่มสำหรับดูรูปภาพ */}
                    {topUp.slipUrl && (
                      <button
                        onClick={() => handleViewImage(topUp.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      >
                        ดูรูป
                      </button>
                    )}

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApproves(topUp.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                      >
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleRejects(topUp.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                      >
                        ปฏิเสธ
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">ยังไม่มีคำขอเติมเงิน</p>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4 ">
          <h1 className="text-xl font-bold text-gray-700">เพิ่มบัญชี</h1>
          <div className="mb-4">
            <form onSubmit={handleSubmit}>
              <ul className="space-y-4">
                <li className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center  space-x-5">
                  <div>
                    <label
                      htmlFor="numberCall"
                      className="block text-sm font-medium text-gray-600"
                    >
                      บัญชีผู้ใช้งาน
                    </label>
                    <input
                      id="numberCall"
                      name="numberCall"
                      type="text"
                      onChange={handleOnChange}
                      value={form.numberCall}
                      placeholder="บัญชีผู้ใช้งาน"
                      className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring focus:ring-orange-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-600"
                    >
                      รหัสผ่าน
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        onChange={handleOnChange}
                        value={form.password}
                        placeholder="รหัสผ่าน"
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring focus:ring-orange-300 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600 focus:outline-none"
                      >
                        {showPassword ? "ซ่อน" : "แสดง"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-600"
                    >
                      หน้าที่
                    </label>
                    <div className="relative">
                      <select
                        id="role"
                        name="role"
                        onChange={handleOnChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring focus:ring-orange-300 focus:outline-none"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    >
                      เพิ่มบัญชี
                    </button>
                  </div>
                </li>
              </ul>
            </form>
            <div className="container mx-auto p-4 overflow-x-auto max-h-[491px]">
              <h1 className="text-2xl font-bold mb-4">รายชื่อผู้ใช้งาน</h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหาผู้ใช้งาน"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="mb-4 px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <table className="min-w-full bg-white border border-gray-300  ">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">
                      บัญชีผู้ใช้งาน
                    </th>
                    <th className="border px-4 py-2 text-left">บทบาท</th>
                    <th className="border px-4 py-2 text-left">เครดิต</th>
                    {role === "master" ? (
                      <th className="border px-4 py-2 text-left">
                        แก้ไขเครดิต
                      </th>
                    ) : (
                      ""
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{user.numberCall}</td>
                      <td className="border px-4 py-2">{user.role}</td>
                      <td className="border px-4 py-2">{user.credit}</td>
                      {role === "master" ? (
                        <td className="border px-4 py-2">
                          <button
                            onClick={() => {
                              const newCredit = prompt(
                                "กรุณากรอกเครดิตใหม่:",
                                user.credit
                              );
                              if (newCredit !== null) {
                                handleEditCredit(
                                  user.id,
                                  parseFloat(newCredit)
                                );
                              }
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                          >
                            แก้ไขเครดิต
                          </button>
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Manage;
