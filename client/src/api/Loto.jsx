import axios from "axios";

export const createLotteryAPI = async (token, form) => {
  // code body
  return await axios.post("http://localhost:3001/api/totteries", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchLotteriesAPI = async (token) => {
  return axios.get("http://localhost:3001/api/totteries", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateLoto = async (token, id, form) => {
  return axios.put(`http://localhost:3001/api/totteries/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const toggleEnabledLoto = async (token, id, enabledStatus) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/api/totteries/${id}`,
      { enabled: enabledStatus }, // ส่งค่าของ enabled เป็น Boolean
      {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ไปด้วย
        },
      }
    );
    return response.data; // คืนค่าผลลัพธ์ที่ได้จาก API
  } catch (error) {
    console.error("Error toggling Loto enabled status:", error);
    throw error;
  }
};
