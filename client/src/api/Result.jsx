import axios from "axios";

export const addResult = async (token, form) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/api/result",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ใส่ token สำหรับการตรวจสอบสิทธิ์
        },
      }
    );
    return response.data; // คืนค่าผลลัพธ์จาก server
  } catch (error) {
    console.error("Error while adding result:", error);
    throw error; // คืนข้อผิดพลาดกลับไปให้กับฟังก์ชันที่เรียกใช้งาน
  }
};

export const listResult = async (token) => {
  return axios.get("http://localhost:3001/api/result", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
