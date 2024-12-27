import React, { useState, useEffect, createContext, useContext } from "react";

// Icon
import Vectorturs from "../assets/img/Vectorturs.png";
import Vectordel from "../assets/img/Vectordel.png";
import Vectorlode from "../assets/img/Vectorlode.png";

const TigetKey = () => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [number, setNumber] = useState(""); // สำหรับเก็บเลขที่ผู้ใช้กรอก
  const [isGenerate, setIsGenerate] = useState(false); // สำหรับตรวจสอบการกดปุ่ม
  // ฟังก์ชันเมื่อคลิกปุ่ม
  const handleGenerateClick = () => {
    setIsGenerate(true); // ตั้งค่าสถานะให้เป็นจริงเมื่อคลิกปุ่ม
  };
  const [previousResults, setPreviousResults] = useState([]); // สำหรับเก็บผลลัพธ์ก่อนหน้า

  // เมื่อกดปุ่มให้คำนวณเลขแบบ "กลับ 2 ตัว"
  useEffect(() => {
    if (number.length === 2) {
      const generatedResults = generateBackTwoDigit(number);
      setPreviousResults((prev) => [...prev, ...generatedResults]); // เก็บผลลัพธ์ใหม่เข้าไปในผลลัพธ์ก่อนหน้า
      setNumber(""); // ล้าง input หลังจากคำนวณ
    }
  }, [number]);

  // ใช้ effect เมื่อกดปุ่มหรือกรอกเลข
  useEffect(() => {
    if (isGenerate && number.length === 2) {
      const generatedResults = generateBackTwoDigit(number);
      setPreviousResults((prev) => [...prev, ...generatedResults]); // เก็บผลลัพธ์ใหม่เข้าไปในผลลัพธ์ก่อนหน้า
      setResults(generatedResults);
      setNumber(""); // ล้าง input หลังจากคำนวณ
      setIsGenerate(false); // รีเซ็ตสถานะปุ่ม
    }
  }, [isGenerate, number]);

  // ฟังก์ชันสำหรับจัดการการคลิกปุ่มตัวเลข
  const handleNumberClick = (number) => {
    if (selectedNumbers.includes(number)) {
      // ถ้าตัวเลขถูกเลือกแล้ว ให้ลบออกจากรายการ
      setSelectedNumbers(selectedNumbers.filter((num) => num !== number));
    } else {
      // ถ้ายังไม่ถูกเลือก ให้เพิ่มเข้าไปในรายการ
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  // ฟังก์ชันสำหรับสร้างชุดเลขแบบ "กลับ 2 ตัว"
  const generateBackTwoDigit = (num) => {
    if (num.length !== 2 || isNaN(num)) {
      return [];
    }
    const direct = num; // เลขตรง
    const reversed = num[1] + num[0]; // เลขกลับ
    return [direct, reversed];
  };

  return (
    <div className=" mt-10">
      <div className="cadit">
        <div className="cadit-ket flex justify-between mt-3">
          <h1>เครดิตคงเหลือ</h1>
          <h1>5,000.00</h1>
        </div>
        <div className="cadit-betall flex justify-between mt-3 mb-3">
          <h1>ยอดเดิมพันทั้งหมด</h1>
          <h1>0.00</h1>
        </div>
      </div>
      <div className="number-input flex justify-center  ">
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          maxLength="2" // จำกัดความยาวไม่เกิน 2 ตัว
          className="number border w-1/2 h-12 flex justify-center text-black"
        />
      </div>
      <div className="key-tiget flex justify-center mt-5">
        <div className="grid grid-cols-3 gap-4 ">
          {[...Array(10)].map(
            (_, i) =>
              i > 0 && (
                <button
                  key={i}
                  className={`border w-32 h-11 rounded-lg ${
                    selectedNumbers.includes(i) ? "selected" : ""
                  }`}
                  onClick={() => handleNumberClick(i)}
                >
                  {i}
                </button>
              )
          )}
          <button className="border w-32 h-11 rounded-lg flex justify-center items-center">
            {" "}
            <img src={Vectorturs} alt="Vectorturs" />
          </button>
          <button className="border w-32 h-11 rounded-lg">0</button>
          <button className="border w-32 h-11 rounded-lg flex justify-center items-center">
            <img src={Vectordel} alt="Vectordel" />
          </button>
        </div>
      </div>
      <div className="history mt-5 ">
        <button className=" w-full border rounded-2xl h-11 bg-[#133A50] flex justify-center items-center text-white">
          {" "}
          <img className="mr-5" src={Vectorlode} alt="Vectorlode" /> โหลดโพย
        </button>
        <div className="sum border  h-20 mt-2">
          <h2 className="ml-3">รายการแทงเลข 0 รายการ</h2>
          {previousResults.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <p className="">{previousResults.join(", ")}</p>
            </div>
          )}
        </div>
        <button className="btcheck w-full border rounded-2xl  mt-2 h-11">
          ตรวจสอบราคา / ตั้งราคาซื้อ
        </button>
      </div>
    </div>
  );
};

export default TigetKey;
