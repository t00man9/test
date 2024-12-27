import { useEffect } from "react";
import useLotteryStore from "../../store/tiget.store";

const AutoOpenLottery = () => {
  const { autoOpenLotteries } = useLotteryStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 1) {
        autoOpenLotteries(); // เปิดหวยที่มีวันตรงกับวันนี้
      }
    }, 60000); // ตรวจสอบทุก 1 นาที

    return () => clearInterval(interval);
  }, [autoOpenLotteries]);

  return null;
};

export default AutoOpenLottery;
