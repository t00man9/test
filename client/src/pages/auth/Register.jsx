import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    numberCall: "",
    password: "",
    confirmPassword: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if numberCall has exactly 10 digits
    if (form.numberCall.length !== 10) {
      toast.error("กรุณากรอกเบอร์ให้ครบ 10 หลัก");
      return;
    }
    if (form.password !== form.confirmPassword) {
      return toast.error("รหัสผ่าน ไม่ตรงกัน");
    }
    try {
      const res = await axios.post("http://localhost:3001/api/register", form);
      toast.success("สมัครสมาชิกสำเร็จ");
      navigate("/");
      console.log(res);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
      console.log(err);
    }
    console.log(form);
  };

  return (
    <div className="home  min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          สมัครสมาชิก
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600"
            >
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                onChange={handleOnChange}
                value={form.confirmPasswordpassword}
                placeholder="ยืนยันรหัสผ่าน"
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

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              สมัครสมาชิก
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
