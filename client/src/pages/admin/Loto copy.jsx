import React, { useState, useEffect } from "react";
import useTigetStore from "../../store/tiget.store";
import { toast } from "react-toastify";
import {
  fetchLotteriesAPI,
  createLotteryAPI,
  updateLoto,
  toggleEnabledLoto,
} from "../../api/Loto";

const Loto = () => {
  const token = useTigetStore((state) => state.token);

  // กำหนดตัวแปร
  const [lotteries, setLotteries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    openDate: "",
    closeDate: "",
    autoRenew: false,
  });

  // เรียกรายการหวย
  // Fetch all lotteries
  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const data = await fetchLotteriesAPI(token);
        // console.log("Fetched Data:", data.data); // ตรวจสอบข้อมูลที่ได้รับ
        setLotteries(Array.isArray(data.data) ? data.data : []); // กำหนดค่าเริ่มต้นเป็น array ว่างถ้าไม่ใช่ array
      } catch (error) {
        console.error("Error fetching lotteries:", error);
      }
    };
    fetchLotteries();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // สร้างหวย
  // Submit new lottery
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLottery = await createLotteryAPI(token, formData);
      setLotteries((prev) => [...prev, newLottery]);
      setFormData({ name: "", openDate: "", closeDate: "", autoRenew: false });
      toast.success("Lottery created successfully!");
    } catch (error) {
      console.error("Error creating lottery:", error);
      toast.error("Failed to create lottery.");
    }
  };

  return (
    <>
      <main className="mt-6 space-y-6 max-w-screen-lg mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">รายการหวยอัตโนมัติ</h1>
            <div className="p-6 max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-4">แอนมิน: ระบบจัดการหวย</h1>

              <form
                onSubmit={handleSubmit}
                className="mb-8 p-4 border rounded-lg"
              >
                <h2 className="text-xl mb-2">สร้างหวย</h2>
                <div className="mb-4">
                  <label className="block mb-1">ชื่อหวย</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1">เวลาวัน/เวลา เปิด</label>
                  <input
                    type="datetime-local"
                    name="openDate"
                    value={formData.openDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1">เวลาวัน/เวลา ปิด</label>
                  <input
                    type="datetime-local"
                    name="closeDate"
                    value={formData.closeDate}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="autoRenew"
                      checked={formData.autoRenew}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    อัตโนมัติ
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  สร้างหวย
                </button>
              </form>

              <h2 className="text-xl font-bold mb-4">Existing Lotteries</h2>
              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2">ชื่อหวย</th>
                    <th className="border p-2">เวลาวัน/เวลา เปิด</th>
                    <th className="border p-2">เวลาวัน/เวลา ปิด</th>
                    <th className="border p-2">อัตโนมัติ</th>
                    <th className="border p-2">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {lotteries.map((lottery, index) => (
                    <tr key={lottery.id || index}>
                      {" "}
                      {/* ใช้ id หรือ index ถ้าไม่มี id */}
                      <td className="border p-2 text-center">{lottery.name}</td>
                      <td className="border p-2 text-center">
                        {new Date(lottery.openDate).toLocaleString()}
                      </td>
                      <td className="border p-2 text-center">
                        {new Date(lottery.closeDate).toLocaleString()}
                      </td>
                      <td className="border p-2 text-center">
                        {lottery.autoRenew ? "ใช่" : "ไม่"}
                      </td>
                      <td className="border p-2 text-center">
                        {lottery.isOpen ? "เปิด" : "ปิด"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Loto;
