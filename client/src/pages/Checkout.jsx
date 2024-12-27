import React, { useEffect, useState } from "react";
import { listTiget } from "../api/Tiget";
import useTigetStore from "../store/tiget.store"; // ใช้ Zustand

const BettingList = () => {
  const token = useTigetStore((s) => s.token);
  const userId = useTigetStore((s) => s.userId);
  console.log("Token:", token);
  console.log("UserId:", userId);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลรายการแทง
  const fetchBets = async () => {
    try {
      const response = await listTiget(token, userId);
      console.log("API Response:", response.data); // ดูข้อมูลที่ได้รับจาก API
      const filteredBets = response.data.bets.filter(
        (bet) => bet.userId === userId
      );
      console.log("Filtered Bets:", filteredBets); // ตรวจสอบข้อมูลหลังจากการกรอง
      setBets(filteredBets);
    } catch (error) {
      console.error("Error fetching bets:", error);
    } finally {
      setLoading(false); // ทำงานในทุกกรณี
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchBets(); // ดึงข้อมูลเมื่อ token และ userId พร้อม
    }
  }, [token, userId]);

  return (
    <div className="home">
      <main className="mt-6 space-y-6 max-w-screen">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-blue-800 font-bold">ผลรางวัล</h2>
          <div className="mt-4 overflow-x-auto max-h-96">
            {loading ? (
              <p>กำลังโหลดข้อมูล...</p>
            ) : bets.length > 0 ? (
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 p-2 text-center">
                      ที่
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      หมายเลข
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      ประเภทเกม
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      กลุ่ม
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      จำนวนเงิน
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      ผลรางวัล
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      จ่าย
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((bet, index) => (
                    <tr key={bet.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {bet.number}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {bet.gameType}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {bet.groupLotto}
                      </td>
                      <td className="border border-gray-300 p-2 text-right  ">
                        {bet.amount}
                      </td>
                      <td className="border border-gray-300 p-2 text-right  flex justify-center">
                        <h2 className="ml-2">ถูกรางวัล</h2>
                        <button className="ml-2">ดู</button>
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        <h2 className="ml-2">90 ฿</h2>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>ไม่พบรายการแทงสำหรับผู้ใช้นี้</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BettingList;
