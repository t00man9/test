import React, { useState } from "react";
import { addCredit } from "../../api/auth";
import useTigetStore from "../../store/tiget.store";

const AddCredit = () => {
  const token = useTigetStore((s) => s.token);
  const userId = useTigetStore((s) => s.userId);

  const [amount, setAmount] = useState("");
  const [slip, setSlip] = useState(null);

  const handleAmountClick = (value) => {
    setAmount(value); // ตั้งค่าจำนวนเงินจากปุ่ม
  };

  const handleFileChange = (e) => {
    setSlip(e.target.files[0]); // เก็บไฟล์สลิปที่ผู้ใช้เลือก
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !slip) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }
    console.log("amount", amount);
    console.log("slip", slip);

    // สร้าง FormData เพื่อส่งข้อมูลไป API
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("slip", slip);

      const response = await addCredit(token, { userId, amount, slip });
      console.log("response", response);

      if (response.status === 201) {
        alert("คำขอเติมเงินถูกส่งแล้ว!");
        setAmount("");
        setSlip(null);
      } else {
        alert("เกิดข้อผิดพลาดในการส่งคำขอ");
      }
    } catch (error) {
      console.error("Error submitting top-up:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };
  return (
    <div className="home">
      <main className="mt-6 space-y-6 max-w-screen ">
        <div className="bg-white p-6 rounded shadow space-y-4">
          <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-xl font-bold text-center mb-4">
              แจ้งเติมเครดิต
            </h1>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* ข้อมูลธนาคาร */}
              <div className="mb-4">
                <h2 className="text-sm font-medium mb-2">โอนเงินเข้าบัญชี</h2>
                <div className="bg-gray-100 p-4 rounded">
                  <p>
                    <strong>ธนาคาร:</strong> ธนาคารกรุงไทย
                  </p>
                  <p>
                    <strong>เลขที่บัญชี:</strong> 123-456-789
                  </p>
                  <p>
                    <strong>ชื่อบัญชี:</strong> บจก. ระบบเติมเครดิต
                  </p>
                </div>
              </div>

              {/* จำนวนเงิน */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  จำนวนเงินที่ต้องการเติม
                </label>
                <input
                  type="number"
                  placeholder="ขั้นต่ำ 1.00 / สูงสุด 500,000.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded mb-2"
                />
                <div className="grid grid-cols-4 gap-2 col-s">
                  {[100, 200, 300, 500, 1000].map((value) => (
                    <button
                      type="button"
                      key={value}
                      className="border py-1 rounded hover:bg-blue-500 hover:text-white"
                      onClick={() => handleAmountClick(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* แนบสลิป */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  แนบสลิปการโอนเงิน
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>

              {/* ข้อความแจ้ง */}
              <p className="text-red-500 text-sm mb-4">
                กรุณาโอนเงินเข้าบัญชีที่ระบุไว้ข้างต้นเท่านั้น!
              </p>

              {/* ปุ่มดำเนินการต่อ */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                ดำเนินการต่อ
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddCredit;
