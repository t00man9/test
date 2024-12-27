import React, { useState } from "react";

// Icon
import Vector from "../assets/img/Vector.png";
import Vectorplus from "../assets/img/Vectorplus.png";

const TigetBet = () => {
  const [Cbet, setCBet] = useState("#ffffff");



  // เปลี่ยนสี
  const handleClick = () => {
    setCBet((prevColor) => (prevColor === "#ffffff" ? "#14C773" : "#ffffff"));
  };

  return (
    <div>
      <div className="h-11 ">
        <ul className="num flex items-center justify-between h-11 ">
          <li>
            <button className="set1 border h-11 w-[266px] text-base font-semibold ">
              สองตัว
            </button>
          </li>
          <li>
            <button className="set1 border h-11 w-[267px] text-base font-semibold">
              สามตัว
            </button>
          </li>
          <li>
            <button className="set1 border h-11 w-[266px] text-base font-semibold">
              เลขวิ่ง
            </button>
          </li>
        </ul>
      </div>
      <div className="selete-bet ">
        <div className="setting1 mt-10">
          <h2>เลือกรูปแบบการแทงเลขสองตัว</h2>
          <div className="flex justify-between  mt-4 ml-3">
            <button
              className="border w-4/6 h-11 rounded-lg flex justify-start items-center "
              style={{ backgroundColor: Cbet }}
              onClick={handleClick}
            >
              <img className="ml-4 mr-7" src={Vector} alt="Vector" />
              สองตัวบน (x90)
            </button>
            <button className="border w-4/6 h-11 rounded-lg ml-3 flex justify-start items-center">
              <img className="ml-4 mr-7" src={Vector} alt="Vector" />
              สองตัวล่าง (x90)
            </button>
          </div>
        </div>
        <div className="setting2 mt-10 ">
          <h2>ตัวเลือกการแทงเพิ่มเติม</h2>
          <div className="flex justify-between  mt-4">
            <button className="border w-4/6 h-11 rounded-lg ml-3 flex justify-start items-center ">
              <img className=" ml-4 mr-7" src={Vector} alt="Vector" />
              กลับสองตัว
            </button>
            <button className="border w-4/6 h-11 rounded-lg ml-3 flex justify-start items-center">
              <img className="ml-4 mr-7" src={Vector} alt="Vector" />
              19 ประตู
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button className="border w-4/6 h-11 rounded-lg ml-3 flex justify-start items-center">
              <img className="ml-4 mr-7" src={Vector} alt="Vector" />
              รูดหน้า
            </button>
            <button className="border w-4/6 h-11 rounded-lg ml-3 flex justify-start items-center">
              <img className="ml-4 mr-7" src={Vector} alt="Vector" />
              รูดหลัง
            </button>
          </div>
        </div>
        <div className="setting3 mt-10 ">
          <h2>เพิ่มเลขตามกลุ่ม</h2>
          <div className="flex justify-between  mt-4">
            <button className="border w-4/6 h-11 rounded-lg ml-3 flex justify-start items-center ">
              <img className=" ml-4 mr-7" src={Vectorplus} alt="Vector" />
              สองตัวต่ำ
            </button>
            <button className="border w-4/6 h-11 rounded-lg ml-3 flex justify-start items-center">
              <img className="ml-4 mr-7" src={Vectorplus} alt="Vector" />
              สองตัวสูง
            </button>
          </div>
          <div className="flex justify-between  mt-4">
            <button className="border w-4/6 h-11 rounded-lg ml-3 flex justify-start items-center">
              <img className="ml-4 mr-7" src={Vectorplus} alt="Vector" />
              สองตัวคู่
            </button>
            <button className="border w-4/6 h-11 rounded-lg ml-3 flex justify-start items-center">
              <img className="ml-4 mr-7" src={Vectorplus} alt="Vector" />
              สองตัวคี่
            </button>
          </div>
          <div className="flex justify-between  mt-4">
            <button className="border w-96 h-11 rounded-lg ml-3 flex justify-start items-center ">
              <img className=" ml-4 mr-7" src={Vectorplus} alt="Vector" />
              เลขเบิ้ล
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TigetBet;
