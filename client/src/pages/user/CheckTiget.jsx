import React, { useState } from "react";

const CheckTiget = () => {
  // สร้าง state สำหรับรายการต่าง ๆ ถ้าคุณต้องการดึงข้อมูลจาก API หรือฐานข้อมูล
  const [items, setItems] = useState([
    { number: "00", price: 0, payout: 0 },
    { number: "01", price: 50, payout: 95 },
    { number: "02", price: 100, payout: 180 },
    { number: "03", price: 150, payout: 300 },
    // เพิ่มรายการอื่น ๆ ตามต้องการ
  ]);

  // คำนวณยอดรวม
  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      <div className="home">
        <main className="mt-6 space-y-6 max-w-screen">
          <div className="w-screen bg-blue-50 flex flex-col items-center">
            <div className="card shadow mb-5 flex">
              <div className="card-header py-3">
                <div className="flex justify-between p-4">
                  <h1>สองตัว</h1>
                  <h1>ยอดรวม: {total.toFixed(2)} บ.</h1>
                </div>
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">ตัวเลข</th>
                      <th className="px-4 py-2 border">ราคาซื้อ</th>
                      <th className="px-4 py-2 border">ราคาจ่าย</th>
                      <th className="px-4 py-2 border">ลบ</th>
                      <th className="px-4 py-2 border">ยอดรวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">{item.number}</td>
                        <td className="px-1 py-2 w- border">
                          <input type="number" />
                        </td>
                        <td className="px-4 py-2 border">{item.payout}</td>
                        <td className="px-4 py-2 border">
                          <button className="text-red-500">ลบ</button>
                        </td>
                        <td className="px-4 py-2 border">
                          {(item.price * 1).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CheckTiget;
