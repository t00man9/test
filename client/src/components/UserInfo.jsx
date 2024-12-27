import React from "react";
import Logo from "../assets/img/Logo.png";
import { Link } from "react-router-dom";

const UserInfo = () => {
  return (
    <div className="overlap">
      <div className="overlap-group">
        <Link to={"/"} className="group">
          <img className="vector" src={Logo} />
        </Link>
        <div className="text-wrapper-2">หวยออนไลน์</div>
        <div className="text-wrapper-3">
          เว็บหวยออนไลน์ที่ให้อัตราจ่ายสูงสุด ชอบเลขไหนตามใจคุณเลย
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
