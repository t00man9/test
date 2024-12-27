import React, { useState, useEffect } from "react";
import useLotteryStore from "../../store/useLotteryStore";
import useTigetStore from "../../store/tiget.store";
import { fetchLotteriesAPI } from "../../api/Loto";
import CreateLotteryForm from "../../components/admin/CreateLotteryForm ";

const Loto = () => {
  const { lotteries, setLotteries, toggleLottery } = useLotteryStore();
  const { token } = useTigetStore();
  const [lot, setLot] = useState([]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchData(); // ดึงข้อมูลใหม่ทุกๆ 1 นาที
  //   }, 60000);

  //   return () => clearInterval(intervalId); // ทำการลบ interval เมื่อคอมโพเนนต์ถูกทำลาย
  // }, []);

  // Fetch all lotteries
  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const data = await fetchLotteriesAPI(token);
        console.log("Fetched Data:", data.data); // ตรวจสอบข้อมูลที่ได้รับ
        setLot(Array.isArray(data.data.lotteries) ? data.data.lotteries : []); // กำหนดค่าเริ่มต้นเป็น array ว่างถ้าไม่ใช่ array
      } catch (error) {
        console.error("Error fetching lotteries:", error);
      }
    };
    fetchLotteries();
  }, []);

  const handleToggleLottery = async (id, currentStatus) => {
    try {
      // สลับสถานะ isOpen
      const newStatus = !currentStatus;

      // อัปเดตสถานะใน Zustand
      await toggleLottery(id);

      // ส่งคำขอ API ไปอัปเดตสถานะ isOpen
      const response = await updateLoto(token, id, { isOpen: newStatus });

      if (response.status === 200) {
        console.log(`สถานะหวย ${newStatus ? "เปิด" : "ปิด"} สำเร็จ`);
      } else {
        console.error("Error updating lottery status");
      }
    } catch (error) {
      console.error("Error toggling lottery:", error);
    }
  };

  return (
    <div className="p-4">
      <CreateLotteryForm />
      <h1 className="text-xl font-bold mb-4">Lottery Management</h1>
      <div>
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">ชื่อหวย</th>
              <th className="border p-2">วัน</th>
              <th className="border p-2">เวลา เปิด</th>
              <th className="border p-2">เวลา ปิด</th>
              <th className="border p-2">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {lot.map((lottery, index) => (
              <tr key={lottery.id || index}>
                {" "}
                {/* ใช้ id หรือ index ถ้าไม่มี id */}
                <td className="border p-2 text-center">{lottery.name}</td>
                <td className="border p-2 text-center">
                  {lottery.openDays.join(",")}
                </td>
                <td className="border p-2 text-center">{lottery.openTime}</td>
                <td className="border p-2 text-center">{lottery.closeTime}</td>
                <td className="border p-2 text-center">
                  {lottery.isOpen ? "เปิด" : "ปิด"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loto;
