import axios from "axios";

export const currenUser = async (token) =>
  await axios.post(
    "http://localhost:3001/api/current-user",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getUsers = async (token) =>
  await axios.get(
    "http://localhost:3001/api/user",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const currenAdmin = async (token) =>
  await axios.post(
    "http://localhost:3001/api/current-admin",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const addCredit = async (token, form) =>
  await axios.post("http://localhost:3001/api/create", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const peadingTopUps = async (token) =>
  await axios.get("http://localhost:3001/api/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const handleApprove = async (token, topUpId) =>
  await axios.put(`http://localhost:3001/api/admin/approve/${topUpId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const handleReject = async (token, topUpId) =>
  await axios.put(`http://localhost:3001/api/admin/Reject/${topUpId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateUserCredit = async (token, userId, newCredit) =>
  await axios.put(
    `http://localhost:3001/api/users/${userId}/update-credit`,
    { credit: newCredit },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
