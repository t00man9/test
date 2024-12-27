const AutoCloseLottery = () => {
  const { lotteries, toggleLottery } = useLotteryStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // เวลาในรูปแบบ "HH:MM"

      lotteries.forEach((lottery) => {
        if (lottery.isOpen && lottery.closeTime === currentTime) {
          toggleLottery(lottery.id); // ปิดหวยเมื่อถึงเวลาปิด
        }
      });
    }, 60000); // ตรวจสอบทุก 1 นาที

    return () => clearInterval(interval);
  }, [lotteries, toggleLottery]);

  return null;
};

export default AutoCloseLottery;
