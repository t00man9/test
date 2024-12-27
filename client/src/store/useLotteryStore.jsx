import { create } from "zustand";

const useLotteryStore = create((set) => ({
  lotteries: [], // ค่าเริ่มต้น
  setLotteries: (data) => set({ lotteries: data }),
  toggleLottery: (id) =>
    set((state) => ({
      lotteries: state.lotteries.map((lottery) =>
        lottery.id === id ? { ...lottery, isOpen: !lottery.isOpen } : lottery
      ),
    })),
}));

export default useLotteryStore;
