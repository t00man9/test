import axios from "axios";

export const createTiget = async (token, form) => {
  return await axios.post("http://localhost:3001/api/category", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listTiget = async (token, userId) => {
  return await axios.get(`http://localhost:3001/api/category/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 5000,
  });
};
