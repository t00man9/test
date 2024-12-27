import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchLotteriesAPI } from "../api/Loto";
import { listTiget } from "../api/Tiget";

const tigetStore = (set) => ({
  numberCall: null,
  token: null,
  credit: null,
  name: null,
  userId: null,
  role: null,
  logout: () =>
    set({
      user: null,
      userId: null,
      token: null,
      categories: [],
      products: [],
      carts: [],
    }), // ฟังก์ชันสำหรับออกจากระบบ
  actionLogin: async (form) => {
    const res = await axios.post("http://localhost:3001/api/login", form);
    set({
      userId: res.data.payload.id, // เก็บ userId
      numberCall: res.data.payload,
      token: res.data.token,
      credit: res.data.payload.credit,
      name: res.data.payload.name,
      role: res.data.payload.role,
    });
    console.log(999, res);
    return res;
  },
  setUserInfo: (updatedInfo) =>
    set((state) => ({
      ...state,
      ...updatedInfo, // อัปเดตข้อมูลที่ส่งเข้ามา
    })),
  getLoto: async (token) => {
    try {
      const res = await fetchLotteriesAPI(token); // ส่ง token ไปยัง API
      set({ Lotos: res.data });
    } catch (err) {
      console.error("Error fetching lotteries:", err);
    }
  },
  fetchBets: async (token) => {
    try {
      set({ loading: true }); // ตั้งสถานะการโหลด
      const res = await listTiget;
      set({ bets: res.data }); // อัปเดต bets
    } catch (err) {
      console.error("Error fetching bets:", err);
    } finally {
      set({ loading: false }); // สถานะการโหลดเสร็จสิ้น
    }
  },
});

const usePersist = {
  name: "tiget",
  storage: createJSONStorage(() => localStorage),
};

const useTigetStore = create(persist(tigetStore, usePersist));

export default useTigetStore;
