import React, { useState } from "react";
import { toast } from "react-toastify";
import useTigetStore from "../store/tiget.store";
import { Link, useNavigate } from "react-router-dom";

import Look from "../assets/img//Group 8.png";

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useTigetStore((s) => s.actionLogin);
  const numberCall = useTigetStore((s) => s.numberCall);

  const [form, setForm] = useState({
    numberCall: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;
      roleRedirect(role);
      toast.success("Welcome Back");
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin" || role === "master") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="login">
        <div className="overlap-wrapper">
          <div className="overlap-2">
            <div className="text-wrapper-4">เข้าสู่ระบบ</div>
            <div className="group-2">
              <div className="group-3">
                <div className="overlap-group-wrapper">
                  <input
                    className="div-wrapper pl-5 pr-40"
                    name="numberCall"
                    type="text"
                    onChange={handleOnChange}
                    placeholder="บัญชีผู้ใช้งาน"
                  />
                </div>
                <div className="text-wrapper-6">บัญชีผู้ใช้งาน</div>
              </div>
              <Link to={"register"} className="group-4">
                <div className="overlap-3">
                  <div className="text-wrapper-7">เปิดบัญชีใหม่</div>
                </div>
              </Link>
              <button className="group-5">
                <div className="overlap-4">
                  <div className="text-wrapper-8">เข้าสู่ระบบ</div>
                </div>
              </button>
              <div className="group-6">
                <div className="overlap-group-wrapper">
                  <input
                    className="div-wrapper pl-5 pr-40"
                    name="password"
                    type="password"
                    onChange={handleOnChange}
                    placeholder="รหัสผ่าน"
                  />
                </div>
                <div className="text-wrapper-10">รหัสผ่าน</div>
              </div>
              <div className="group-wrapper">
                <div className="group-7 flex items-center">
                  <div className="text-wrapper-11">จดจำรหัสผ่าน</div>
                  <input type="checkbox" />
                </div>
              </div>
              <Link className="group-8 flex items-center">
                <div className="text-wrapper-12">ลืมรหัสผ่าน?</div>
                <img className="group-9" src={Look} />
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
