import React, { useState, useEffect } from "react";
import useTigetStore from "../../store/tiget.store";
import { Link } from "react-router-dom";
import { createTiget } from "../../api/Tiget";
import { toast } from "react-toastify";
import { FaListAlt } from "react-icons/fa";
// Img
import Vectorturs from "../../assets/img/Vectorturs.png";
import Vectordel from "../../assets/img/Vectordel.png";
import Vectorlode from "../../assets/img/Vectorlode.png";
import Vector from "../../assets/img/Vector.png";
import Vectorplus from "../../assets/img/Vectorplus.png";

// Component
// import TigetBet from "../components/Tiget.bet";
// import TigetKey from "../components/Tiget.key";

// icon
import { FaArrowCircleLeft } from "react-icons/fa";
const Tiget = () => {
  const token = useTigetStore((s) => s.token);
  const userInfo = useTigetStore((s) => s.numberCall);

  console.log("userInfo", userInfo);

  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [gameType, setGameType] = useState("TWO_DIGIT");
  const [betType, setBetType] = useState("TOP");
  const [checkType, setCheckType] = useState("");
  const [numberArray, setNumberArray] = useState([]); // สร้าง state สำหรับเก็บเลข
  const [selectedNumber, setSelectedNumber] = useState("");

  const handleSunmit = async (e) => {
    e.preventDefault();
    if (!gameType || !betType) {
      toast.error("กรุณาเลือกประเภทการเล่นและประเภทการเดิมพัน");
      return;
    }
    try {
      const res = await createTiget(token, {
        numbers: numberArray.map((num) => ({
          number: String(num), // แปลงตัวเลขให้เป็น string
          amount: amount, // ใส่จำนวนเงินที่สัมพันธ์กับหมายเลข
          gameType: gameType, // gameType ของหมายเลขนี้
          betType: betType, // betType ของหมายเลขนี้
        })),
      });
      console.log("Betsetting", res);

      toast.success(`แทงสำเร็จ`);
      setNumberArray([]);
      setAmount(0); // เคลียร์ amount หลังแทงสำเร็จ

      // ลบ amount ออกจาก userInfo.credit
      setUserInfo((prev) => ({
        ...prev,
        credit: prev.credit - amount,
      }));
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (checkType) {
      // เช็คว่า checkType ไม่ว่าง
      checkType;
    }
  }, [checkType]); // ใช้ checkType เป็น dependency
  // -----------------------------------------------------
  const handleClear = () => setNumber("");

  const handleDelete = () => {
    setNumber((prev) => prev.slice(0, -1)); // ลบตัวเลขตัวสุดท้าย
  };

  const handleNumberClick = (num) => {
    setNumber((prev) =>
      (prev + num.toString()).slice(0, gameType === "TWO_DIGIT" ? 2 : 3)
    );
    console.log("Number", number);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    console.log("value", value);
    // const newValue = number + num;
    // อัปเดตค่า input
    // setNumber(newValue);
    setNumber(value);
    // ตรวจสอบจำนวนตัวเลขที่กรอก
    if (
      (gameType === "TWO_DIGIT" && value.length === 2) ||
      (gameType === "TWO_DIGIT" &&
        value.length === 1 &&
        checkType === "NIGHTY_GOOL") ||
      (gameType === "TWO_DIGIT" &&
        value.length === 1 &&
        checkType === "SWIPE_FACE") ||
      (gameType === "TWO_DIGIT" &&
        value.length === 1 &&
        checkType === "SWIPE_BACK") ||
      (gameType === "TWO_DIGIT" &&
        checkType === "TWO_DIGIT_LOW" &&
        value.length === 0)
    ) {
      if (checkType === "TWO_REVERSE") {
        const reversedNumber = value.split("").reverse().join("");
        setNumberArray((prev) => {
          const newArray = [...prev, value, reversedNumber];
          setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
          return newArray;
        });
      } else if (checkType === "NIGHTY_GOOL") {
        const results = [];

        for (let i = 0; i <= 9; i++) {
          if (value === i.toString()) {
            results.push(`${value}${i}`);
          } else {
            results.push(`${value}${i}`, `${i}${value}`);
          }
        }
        setNumberArray((prev) => {
          const newArray = [...prev, ...results];
          setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
          return newArray;
        });
      } else if (checkType === "SWIPE_FACE") {
        const results = [];

        for (let i = 0; i <= 9; i++) {
          results.push(`${value}${i}`);
        }
        setNumberArray((prev) => {
          const newArray = [...prev, ...results];
          setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
          return newArray;
        });
      } else if (checkType === "SWIPE_BACK") {
        const results = [];

        for (let i = 0; i <= 9; i++) {
          results.push(`${i}${value}`);
        }
        setNumberArray((prev) => {
          const newArray = [...prev, ...results];
          setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
          return newArray;
        });
      } else {
        // ถ้า checkType ไม่ตรงกับเงื่อนไขใด ๆ ข้างต้น
        setNumberArray((prev) => {
          const newArray = [...prev, value];
          setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
          return newArray;
        });
      }
      setNumber(""); // ล้าง input หลังเพิ่มเลข
    } else if (gameType === "THREE_DIGIT" && value.length === 3) {
      if (checkType === "THREE_REVERSE") {
        const reversedNumber = value.split("").reverse().join("");
        setNumberArray((prev) => {
          const newArray = [...prev, reversedNumber];
          setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
          return newArray;
        });
      }
      setNumberArray((prev) => {
        const newArray = [...prev, value];
        setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
        return newArray;
      });
      setNumber(""); // ล้าง input หลังเพิ่มเลข
      handleNumberChange({ target: { value: newValue } });
    }
  };

  const twoDigitLow = () => {
    const numbers = [];
    for (let i = 0; i < 50; i++) {
      // ใช้ padStart เพื่อให้มีสองหลัก
      const formattedNumber = String(i).padStart(2, "0");
      numbers.push(formattedNumber);
      console.log(numbers);
    }
    setNumberArray((prev) => {
      const newArray = [...prev, ...numbers];
      setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
      return newArray;
    });
  };

  const twoDigitHigh = () => {
    const numbers = [];
    for (let i = 50; i <= 99; i++) {
      // ใช้ padStart เพื่อให้มีสองหลัก
      const formattedNumber = String(i).padStart(2, "0");
      numbers.push(formattedNumber);
      console.log(numbers);
    }
    setNumberArray((prev) => {
      const newArray = [...prev, ...numbers];
      setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
      return newArray;
    });
  };

  const twoDigitEven = () => {
    const evenNumbers = [];
    for (let i = 0; i <= 99; i++) {
      if (i % 2 === 0) {
        // ใช้ padStart เพื่อให้มี 2 หลัก
        evenNumbers.push(i.toString().padStart(2, "0"));
      }
    }
    setNumberArray((prev) => {
      const newArray = [...prev, ...evenNumbers];
      setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
      return newArray;
    });
  };

  const twoDigitOdd = () => {
    const oddNumbers = [];
    for (let i = 0; i <= 99; i++) {
      if (i % 2 !== 0) {
        // ตรวจสอบว่าเป็นเลขคี่
        oddNumbers.push(i < 10 ? `0${i}` : i.toString()); // เพิ่มเลขในรูปแบบ 00, 01, ...
      }
    }
    setNumberArray((prev) => {
      const newArray = [...prev, ...oddNumbers];
      setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
      return newArray;
    });
  };

  const twoDigitDouble = () => {
    const doubleNumbers = [];
    for (let i = 0; i <= 9; i++) {
      const doubleNumber = `${i}${i}`; // สร้างเลขเบิ้ล
      doubleNumbers.push(doubleNumber);
    }
    setNumberArray((prev) => {
      const newArray = [...prev, ...doubleNumbers];
      setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
      return newArray;
    });
  };

  return (
    <div className="home ">
      <main className="mt-6 space-y-6 max-w-screen  ">
        <div className=" w-screen bg-blue-50 flex flex-col items-center  ">
          <h1>หวยที่เลือก </h1>
          <div className="num  items-center  h-11 flex w-full max-w-md justify-around  bg-white rounded-t-lg  ">
            <button
              className={`flex-1 p-4 text-center ${
                gameType === "TWO_DIGIT"
                  ? "bg-blue-200 text-black"
                  : "bg-white text-black"
              }`}
              onClick={() => {
                setGameType("TWO_DIGIT");
              }}
            >
              2 ตัว
            </button>
            <button
              className={`flex-1 p-4 text-center ${
                gameType === "THREE_DIGIT"
                  ? "bg-blue-200 text-black"
                  : "bg-white text-black"
              }`}
              onClick={() => {
                setGameType("THREE_DIGIT");
              }}
            >
              3 ตัว
            </button>
            <button
              className={`flex-1 p-4 text-center ${
                gameType === "RUN_DIGIT"
                  ? "bg-blue-200 text-black"
                  : "bg-white text-black"
              }`}
              onClick={() => {
                setGameType("RUN_DIGIT");
              }}
            >
              เลขวิ่ง
            </button>
          </div>
          {gameType === "TWO_DIGIT" ? (
            <div className="selete-bet bg-white w-full max-w-md p-4 rounded-b-lg shadow">
              <div className="setting1 ">
                <h2 className="text-center font-medium mb-2">
                  เลือกรูปแบบการแทงเลขสองตัว
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    className="border btn-option  "
                    onClick={() => {
                      setBetType("TOP");
                    }}
                  >
                    2 ตัวบน
                  </button>
                  <button
                    className="border btn-option"
                    onClick={() => {
                      setBetType("BOTTOM");
                    }}
                  >
                    2 ตัวล่าง
                  </button>
                </div>
              </div>
              <div className="setting1 ">
                <h2 className="text-center font-medium mb-2">
                  ตัวเลือกการแทงเพิ่มเติม
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    className="border btn-option"
                    onClick={() => setCheckType("TWO_REVERSE")}
                  >
                    กลับสองตัว
                  </button>
                  <button
                    className="border btn-option"
                    onClick={() => setCheckType("NIGHTY_GOOL")}
                  >
                    19 ประตู
                  </button>
                  <button
                    className="border btn-option"
                    onClick={() => setCheckType("SWIPE_FACE")}
                  >
                    รูดหน้า
                  </button>
                  <button
                    className="border btn-option"
                    onClick={() => setCheckType("SWIPE_BACK")}
                  >
                    รูดหลัง
                  </button>
                </div>
              </div>
              <div>
                <h2 className="text-center font-medium mb-2">
                  เพิ่มเลขตามกลุ่ม
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    className="border btn-option"
                    onClick={() => twoDigitLow()}
                  >
                    สองตัวต่ำ
                  </button>
                  <button
                    className="border btn-option"
                    onClick={() => twoDigitHigh()}
                  >
                    สองตัวสูง
                  </button>
                  <button
                    className="border btn-option"
                    onClick={() => {
                      twoDigitEven();
                    }}
                  >
                    สองตัวคู่
                  </button>
                  <button
                    className="border btn-option"
                    onClick={() => {
                      twoDigitOdd();
                    }}
                  >
                    สองตัวคี่
                  </button>
                  <button
                    className="border btn-option"
                    onClick={() => {
                      twoDigitDouble();
                    }}
                  >
                    เลขเบิ้ล
                  </button>
                </div>
              </div>
            </div>
          ) : gameType === "THREE_DIGIT" ? (
            <div className="selete-bet bg-white w-full max-w-md p-4 rounded-b-lg shadow">
              <div className="setting1 mt-10 ">
                <h2 className="text-center font-medium mb-2">
                  เลือกรูปแบบการแทงเลขสองตัว
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    className="border btn-option"
                    onClick={() => {
                      setBetType("TOP");
                    }}
                  >
                    สามตัวบน (x900)
                  </button>
                  <button className="border btn-option">สามโต๊ด (x150)</button>
                </div>
              </div>
              <div>
                <h2 className="text-center font-medium mb-2">
                  ตัวเลือกการแทงเพิ่มเติม
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    className="border btn-option"
                    onClick={() => setCheckType("THREE_REVERSE")}
                  >
                    กลับสามตัว
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="selete-bet bg-white w-full max-w-md p-4 rounded-b-lg shadow">
              <div className="setting1 mt-10">
                <h2 className="text-center font-medium mb-2">
                  เลือกรูปแบบการแทงเลขสองตัว
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button className="border btn-option">วิ่งบน (x3.2)</button>
                  <button className="border btn-option">วิ่งล่าง (x4.2)</button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between w-[448px] bg-blue-100  flex-col  p-4">
            <h1 className="ml-10">
              เครดิตคงเหลือ <span className="ml-52">{userInfo.credit} </span>{" "}
            </h1>
            <h1 className="ml-10">
              ยอดเดิมพันทั้งหมด{" "}
              <span className="text-red-700 ml-52">{amount} </span>
            </h1>
          </div>
          <div className="selete-bet bg-white w-full max-w-md p-4  shadow flex justify-center">
            <form onSubmit={handleSunmit}>
              <input
                className="border w-full p-4 text-center"
                type="text"
                value={number}
                maxLength={
                  (gameType === "TWO_DIGIT" && checkType === "TWO_REVERSE") ||
                  (gameType === "TWO_DIGIT" && !checkType)
                    ? 2
                    : gameType === "THREE_DIGIT"
                    ? 3
                    : gameType === "TWO_DIGIT" && checkType === "NIGHTY_GOOL"
                    ? 1
                    : ""
                }
                onChange={handleNumberChange}
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                  <div
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    className="btn-number text-center"
                  >
                    {num}
                  </div>
                ))}
                <div onClick={handleClear} className="btn-number text-center">
                  🗑️
                </div>
                <div
                  onClick={() => handleNumberClick(0)}
                  className="btn-number text-center"
                >
                  0
                </div>
                <div onClick={handleDelete} className="btn-number text-center">
                  🔙
                </div>
              </div>
              <button
                // to="/user/checktigetbetting"
                className="mt-5 flex items-center gap-2 px-6 py-3 bg-yellow-400 text-white font-bold text-lg rounded-md shadow-md hover:bg-yellow-500 transition duration-300"
              >
                <FaListAlt /> {/* ไอคอน */}
                ตรวจสอบรายการ / ตั้งราคาซื้อ
              </button>
            </form>
          </div>
          <div className="selete-bet bg-white w-full max-w-md p-4 rounded-lg shadow ">
            <h1 className="mb-4 text-lg font-bold">
              รายการแทงเลข {numberArray.length} รายการ{" "}
            </h1>
            <div className="max-h-40 gap-4  overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-purple-900 ">
              {numberArray.map((num, index) => (
                <button
                  key={index}
                  className="p-2 bg-blue-500 rounded-md hover:bg-blue-700 text-white "
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Tiget;
