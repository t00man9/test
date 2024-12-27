import React, { useEffect, useState } from "react";
import useTigetStore from "../../store/tiget.store";
import { addResult, listResult } from "../../api/Result";
import { fetchLotteriesAPI } from "../../api/Loto"; // เพิ่มการเรียก API สำหรับ Loto
import { toast } from "react-toastify";

const Payout = () => {
  const token = useTigetStore((state) => state.token);
  const [formData, setFormData] = useState({
    lotteryName: "",
    winningNumber: "",
    threeDigit: "",
    twoDigit: "",
    twoDigitLower: "",
    round: "",
    date: "",
  });
  const [Result, setResult] = useState([]);
  const [lotteryList, setLotteryList] = useState([]); // State สำหรับเก็บรายการหวย

  useEffect(() => {
    getResult(token);
    fetchLoto(token); // ดึงรายการ Loto ตอนโหลดหน้า
  }, [token]);

  const getResult = async (token) => {
    try {
      const res = await listResult(token);
      setResult(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLoto = async (token) => {
    try {
      const res = await fetchLotteriesAPI(token); // เรียก API รายการ Loto
      setLotteryList(res.data); // เก็บข้อมูลใน State
    } catch (error) {
      console.log("Error fetching Loto list:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithDate = {
        ...formData,
        date: new Date().toISOString(),
      };
      const result = await addResult(token, formDataWithDate);
      toast.success("ผลรางวัลบันทึกสำเร็จ");
      setFormData({
        lotteryName: "",
        winningNumber: "",
        threeDigit: "",
        twoDigit: "",
        twoDigitLower: "",
        round: "",
        date: "",
      });
      await getResult(token); // ดึงข้อมูลใหม่หลังจากเพิ่มสำเร็จ
    } catch (error) {
      console.log("error", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกผลรางวัล");
    }
  };

  return (
    <>
      <main className="mt-6 space-y-6 max-w-screen ">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-2xl font-bold mb-4">เพิ่มผลรางวัล</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">ชื่อหวย</label>
              <select
                name="lotteryName"
                value={formData.lotteryName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">-- เลือกชื่อหวย --</option>
                {Array.isArray(lotteryList) &&
                  lotteryList.map((lotto) => (
                    <option key={lotto.id} value={lotto.name}>
                      {lotto.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">เลขที่ถูกรางวัล</label>
              <input
                type="text"
                name="winningNumber"
                value={formData.winningNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">เลข 3 ตัว</label>
              <input
                type="text"
                name="threeDigit"
                value={formData.threeDigit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">เลข 2 ตัว</label>
              <input
                type="text"
                name="twoDigit"
                value={formData.twoDigit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">เลข 2 ตัวล่าง</label>
              <input
                type="text"
                name="twoDigitLower"
                value={formData.twoDigitLower}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">รอบ</label>
              <input
                type="number"
                name="round"
                value={formData.round}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              บันทึกผลรางวัล
            </button>
          </form>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">ชื่อ หวย</th>
                <th className="px-4 py-2 border">รางวัลที่ออก</th>
                <th className="px-4 py-2 border">3 ตัว</th>
                <th className="px-4 py-2 border">2 ตัวบน</th>
                <th className="px-4 py-2 border">2 ตัวล่าง</th>
                <th className="px-4 py-2 border">รอบ</th>
              </tr>
            </thead>
            <tbody>
              {Result.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="px-4 py-2 border">{item.id}</td>
                  <td className="px-4 py-2 border">{item.lotteryName}</td>
                  <td className="px-4 py-2 border">{item.winningNumber}</td>
                  <td className="px-4 py-2 border">{item.threeDigit}</td>
                  <td className="px-4 py-2 border">{item.twoDigit}</td>
                  <td className="px-4 py-2 border">{item.twoDigitLower}</td>
                  <td className="px-4 py-2 border">{item.round}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Payout;
