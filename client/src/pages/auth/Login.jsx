import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useTigetStore from "../../store/tiget.store";
import { useNavigate } from "react-router-dom";

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
      <form
        onSubmit={handleSubmit}
        className="login flex justify-center items-center  h-full md:w-[30rem] lg:w-[30rem] md:h-[36rem] lg:h-[36rem] mt-10 border"
      >
        <div className="formlogin">
          <div>
            <h2>เข้าสู่ระบบ</h2>
          </div>
          <div className="userId">
            <p>บัญชีผู้ใช้งาน</p>
            <input
              className="border rounded-2xl py-1 px-3 m-2"
              name="numberCall"
              type="text"
              onChange={handleOnChange}
              placeholder="บัญชีผู้ใช้งาน"
            />
          </div>
          <div className="passwordId">
            <p>รหัสผ่าน</p>
            <input
              className="border rounded-2xl py-1 px-3 m-2"
              name="password"
              type="password"
              onChange={handleOnChange}
              placeholder="รหัสผ่าน"
            />
          </div>
          <div className="record flex space-x-7 ">
            <div>
              <input type="checkbox" title="จดจำรหัสผ่าน" />
              <label className="ml-1">จดจำรหัสผ่าน</label>
            </div>
            <div>
              <a href="#">ลืมรหัสผ่าน?</a>
            </div>
          </div>
          <div className="seed ">
            <button className=" p-1 px-3 py-3 w-44 h-14 rounded-[4rem] bg-[#133A50] text-white drop-shadow-lg">
              เปิดบัญชีใหม่
            </button>
            <button className="ml-3 p-1 px-3 py-3 w-44 h-14 rounded-[4rem] bg-[rgb(232,128,72)] drop-shadow-lg">
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </form>
    </div>
    // <div>
    //   Login
    //   <form onSubmit={handleSubmit}>
    //     NumberCall
    //     <input
    //       className="border"
    //       name="numberCall"
    //       type="text"
    //       onChange={handleOnChange}
    //     />
    //     Password
    //     <input
    //       className="border"
    //       name="password"
    //       type="text"
    //       onChange={handleOnChange}
    //     />
    //     <button className="border ml-3">Login</button>
    //   </form>
    // </div>
  );
};

export default Login;
