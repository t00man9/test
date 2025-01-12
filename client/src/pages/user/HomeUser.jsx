import React, { useEffect, useState } from "react";
import useTigetStore from "../../store/tiget.store";
import { useNavigate } from "react-router-dom";
import { fetchLotteriesAPIActive, toggleEnabledLoto } from "../../api/Loto"; // เรียกใช้ toggleEnabledLoto จาก API
import { toast } from "react-toastify";
import dayjs from "dayjs";

const HomeUser = () => {
  const navigate = useNavigate();
  const token = useTigetStore((state) => state.token);
  const [lotteries, setLotteries] = useState([]);

  const handleAddGroup = (name) => {
    console.log("Navigate triggered with group:", name); // Debug
    if (!name) return; // ตรวจสอบว่า name มีค่าหรือไม่
    navigate(`/user/newTiget?group=${name}`);
  };
  useEffect(() => {
    getLotto(token);
  }, [token]);

  const getLotto = async (token) => {
    try {
      const res = await fetchLotteriesAPIActive(token);
      console.log("API Response:", res); // ตรวจสอบข้อมูลที่ได้รับ
  
      // ตรวจสอบว่ามีข้อมูล activeLotteries หรือไม่
      if (res?.data?.activeLotteries) {
        const lotteriesWithTime = res.data.activeLotteries.map((lotto) => ({
          ...lotto,
          remainingTime: calculateRemainingTime(lotto), // คำนวณเวลาที่เหลือ
        }));
        console.log("lotteriesWithTime", lotteriesWithTime);
        setLotteries(lotteriesWithTime); // อัปเดต state
      } else {
        throw new Error("ไม่มีข้อมูลหวยที่ใช้งาน");
      }
    } catch (error) {
      console.error("Error fetching lotteries:", error);
      toast.error("ไม่สามารถดึงข้อมูลหวยได้");
    }
  };
  

  // const updateLotteryStatus = async (id) => {
  //   try {
  //     await toggleEnabledLoto(token, id, { isOpen: false }); // ปิดสถานะ
  //     setLotteries((prevLotteries) =>
  //       prevLotteries.map((lotto) =>
  //         lotto.id === id
  //           ? { ...lotto, isOpen: false, remainingTime: "ปิดแล้ว" }
  //           : lotto
  //       )
  //     );
  //     toast.success(`อัปเดตสถานะหวย ID ${id} เป็นปิดเรียบร้อยแล้ว`);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("ไม่สามารถอัปเดตสถานะหวยได้");
  //   }
  // };

  const calculateRemainingTime = (lotto) => {
    const now = dayjs();
    const today = dayjs().format("YYYY-MM-DD");
    const openTime = dayjs(`${today}T${lotto.openTime}`);
    const closeTime = dayjs(`${today}T${lotto.closeTime}`);
  
    let remainingDuration;
  
    if (now.isBefore(openTime)) {
      // หากยังไม่ถึงเวลาเปิด
      remainingDuration = openTime.diff(now, "second");
    } else if (now.isBefore(closeTime)) {
      // หากอยู่ในช่วงเวลาเปิด
      remainingDuration = closeTime.diff(now, "second");
    } else {
      // เวลาปิดแล้ว
      return "ปิดแล้ว";
    }
  
    const hours = Math.floor(remainingDuration / 3600);
    const minutes = Math.floor((remainingDuration % 3600) / 60);
    const seconds = remainingDuration % 60;
  
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  

  useEffect(() => {
    const interval = setInterval(() => {
      setLotteries((prevLotteries) =>
        prevLotteries.map((lotto) => ({
          ...lotto,
          remainingTime: calculateRemainingTime(lotto),
        }))
      );
    }, 1000); // อัปเดตทุก 1 วินาที
  
    return () => clearInterval(interval);
  }, []);  

  const LotteryCard = ({
    title,
    remainingTime,
    openTime,
    closeTime,
    enabled,
    onClick,
    openDays,
  }) => (
    <button
      onClick={() => {
        console.log("Card clicked:", title); // Debug
        onClick && onClick();
      }}
      className={`text-left w-1/2 shadow-lg p-4 rounded ${
        remainingTime === "ปิดแล้ว" || !enabled
          ? "border-2 border-red-500"
          : "bg-white"
      }`}
    >
      <h3 className="text-blue-600 font-semibold">{title}</h3>
      <p className={remainingTime === "ปิดแล้ว" ? "text-red-600" : "text-green-600"}>
        เวลาที่เหลือ: {remainingTime}
      </p>
      <p>เวลาเปิด: {openTime}</p>
      <p>เวลาปิด: {closeTime}</p>
      {/* <p>เปิดวัน: {openDays.join(", ")}</p> */}
    </button>
  );
  
  return (
    <div className="home">
      <main className="mt-6 space-y-6 max-w-screen ">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-blue-800 font-bold">หวยออนไลน์</h2>
          <div className="flex flex-wrap gap-4">
            {lotteries.map((lotto) => (
              <LotteryCard
                key={lotto.id}
                title={lotto.name}
                openTime={lotto.openTime}
                closeTime={lotto.closeTime}
                remainingTime={lotto.remainingTime}
                enabled={lotto.active}
                openDays={lotto.openDays}
                onClick={() => handleAddGroup(lotto.name)}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-between space-x-4">
            <button className="bg-yellow-400 px-6 py-2 w-1/2 rounded">
              ดูผลรางวัล
            </button>
            <button className="bg-blue-300 px-6 py-2 w-1/2 rounded">
              รายการการเดิมพัน
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-blue-800 font-bold">หวยเด่นวันนี้</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 ">
            {lotteries.slice(0, 2).map((lotto) => (
              <LotteryCard
                key={lotto.id}
                title={lotto.name}
                openTime={lotto.openTime}
                closeTime={lotto.closeTime}
                remainingTime={lotto.remainingTime}
                enabled={lotto.isOpen}
                onClick={() => handleAddGroup(lotto.name)} // ส่ง onClick
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeUser;
