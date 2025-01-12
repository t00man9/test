const prisma = require("../config/prisma");
const { PrismaClient } = require("@prisma/client");

const isWithinLotterySchedule = (lottery, currentDate) => {
  const start = new Date(lottery.openTime);
  const end = new Date(lottery.closeTime);
  const current = new Date(currentDate);

  const dayOfWeek = current.getDay(); // คืนค่าหมายเลขของวัน (0 = อาทิตย์, 1 = จันทร์, ... 6 = เสาร์)

  // แปลงชื่อวันใน openDays เป็นหมายเลขของวัน
  const dayMapping = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  const validDays = lottery.openDays.map((day) => dayMapping[day]);

  // ตรวจสอบเงื่อนไข
  const isInRange = current >= start && current <= end;
  const isValidDay = validDays.includes(dayOfWeek);

  return isInRange && isValidDay;
};

exports.updateLotteryStatus = async () => {
  try {
    const now = new Date();

    // ดึงรายการหวยทั้งหมด
    const lotteries = await prisma.lottery.findMany();

    for (const lottery of lotteries) {
      const today = now.toLocaleString("en-US", { weekday: "long" });

      // เช็คว่าวันนี้อยู่ในวันเปิดของหวยหรือไม่
      if (lottery.openDays.includes(today)) {
        if (now >= lottery.openTime && now <= lottery.closeTime) {
          // เปิดหวยในช่วงเวลาที่กำหนด
          if (!lottery.isOpen) {
            await prisma.lottery.update({
              where: { id: lottery.id },
              data: { isOpen: true },
            });
            console.log(`${lottery.name} is now open!`);
          }
        } else {
          // ปิดหวยเมื่อหมดเวลา
          if (lottery.isOpen) {
            await prisma.lottery.update({
              where: { id: lottery.id },
              data: { isOpen: false },
            });
            console.log(`${lottery.name} is now closed!`);
          }
        }
      } else {
        // ปิดหวยหากไม่ใช่วันเปิด
        if (lottery.isOpen) {
          await prisma.lottery.update({
            where: { id: lottery.id },
            data: { isOpen: false },
          });
          console.log(`${lottery.name} is closed (not open today).`);
        }
      }
    }
  } catch (err) {
    console.error("Error updating lottery status:", err);
  }
};

exports.createLottery = async (req, res) => {
  try {
    const { name, openTime, closeTime, openDays, group, type, active } = req.body;
    console.log(type)
    const newLottery = await prisma.lottery.create({
      data: {
        name,
        openTime,
        closeTime,
        openDays,
        group,
        type,
        active: true,
      },
    });

    res.status(201).json(newLottery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLottery = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, openDate, closeDate, openDays, autoOpenNext } = req.body;

    const updatedLottery = await prisma.lottery.update({
      where: { id: parseInt(id) },
      data: {
        name,
        openDate: new Date(openDate),
        closeDate: new Date(closeDate),
        openDays,
        autoOpenNext,
      },
    });

    res.status(200).json(updatedLottery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLotteries = async (req, res) => {
  try {
    // อัปเดตสถานะ lottery ที่เวลาปัจจุบันมากกว่า closeDate
    await prisma.lottery.updateMany({
      where: {
        closeDate: {
          lt: new Date(), // ปิดรับเมื่อเวลาปัจจุบันมากกว่า closeDate
        },
      },
      data: {
        isOpen: false, // เปลี่ยนสถานะเป็น false (Close)
      },
    });

    // ดึงข้อมูลทั้งหมดของ lottery หลังจากอัปเดตสถานะ
    const lotteries = await prisma.lottery.findMany();

    // ส่งข้อมูลกลับไปยัง client
    res.status(200).json(lotteries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving lotteries", error });
  }
};

exports.updateSystemStatus = async () => {
  try {
    const timeInBangkok = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );

    // แปลง `timeInBangkok` เป็น string ที่สามารถใช้กับ Prisma ได้
    const bangkokTimeString = timeInBangkok.toISOString(); // ใช้ toISOString เพื่อแปลงเป็นรูปแบบที่ Prisma รองรับ

    console.log(bangkokTimeString);

    console.log("bangkokTime", bangkokTimeString);

    // ปิดหวยที่เวลาปัจจุบันเกิน closeTime
    await prisma.lottery.updateMany({
      where: {
        closeTime: {
          lt: bangkokTimeString, // ใช้เวลาของประเทศไทย
        },
        isOpen: true,
      },
      data: {
        isOpen: false,
      },
    });

    // เปิดหวยที่เวลาปัจจุบันมากกว่า openTime และยังไม่เปิด
    await prisma.lottery.updateMany({
      where: {
        openTime: {
          lte: bangkokTimeString, // เวลาเปิดน้อยกว่าหรือเท่ากับปัจจุบัน
        },
        isOpen: false, // ตรวจสอบว่าปัจจุบันปิดอยู่
      },
      data: {
        isOpen: true, // เปิดหวย
      },
    });

    console.log("Lottery status updated successfully");
  } catch (error) {
    console.error("Error updating system status:", error);
  }
};

exports.setAutoOpen = async (req, res) => {
  const { id } = req.params;
  const { autoOpenNextDay } = req.body;

  try {
    const lottery = await prisma.lottery.update({
      where: { id: Number(id) },
      data: { autoOpenNextDay },
    });

    res.status(200).json({ message: "Auto-open setting updated", lottery });
  } catch (error) {
    console.error("Error setting auto-open:", error);
    res.status(500).json({ error: "Error setting auto-open" });
  }
};

exports.createOrUpdateLottery = async (req, res) => {
  const { name, openDays, openTime, closeTime } = req.body;

  try {
    const lottery = await prisma.lottery.upsert({
      where: { name },
      update: { openDays, openTime, closeTime },
      create: { name, openDays, openTime, closeTime },
    });

    res.status(200).json({ message: "Lottery created/updated", lottery });
  } catch (error) {
    console.error("Error creating/updating lottery:", error);
    res.status(500).json({ error: "Error creating/updating lottery" });
  }
};

exports.getLotteries = async (req, res) => {
  try {
    const lotteries = await prisma.lottery.findMany();
    res.status(200).json({ lotteries });
  } catch (error) {
    console.error("Error fetching lotteries:", error);
    res.status(500).json({ error: "Error fetching lotteries" });
  }
};

exports.getActiveLotteries = async () => {
  try {
    const now = new Date();

    // ดึงวันปัจจุบันใน Timezone ไทย
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Bangkok" });

    // ดึงเวลาปัจจุบันในรูปแบบ "HH:mm:ss"
    const currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      timeZone: "Asia/Bangkok",
    });

    // ดึงลอตเตอรี่ทั้งหมด
    const lotteries = await prisma.lottery.findMany();

    // กรองข้อมูลลอตเตอรี่ที่เปิดอยู่
    const activeLotteries = lotteries.filter((lottery) => {
      const openDays = lottery.openDays; // ค่านี้เป็น JSON
      return (
        Array.isArray(openDays) &&
        openDays.includes(currentDay) && // ตรวจสอบวัน
        lottery.openTime <= currentTime && // ตรวจสอบเวลาเปิด
        lottery.closeTime >= currentTime   // ตรวจสอบเวลาปิด
      );
    });

    return activeLotteries;
  } catch (error) {
    console.error("Error fetching active lotteries:", error);
    throw new Error("Error fetching active lotteries");
  }
};


exports.getAPIActiveLotteries = async (req, res) => {
  try {
    const now = new Date();

    // ดึงวันปัจจุบันใน Timezone ไทย
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Bangkok" });

    // ดึงเวลาปัจจุบันในรูปแบบ "HH:mm:ss"
    const currentTime = now.toLocaleTimeString("en-US", {
      hour12: false,
      timeZone: "Asia/Bangkok",
    });

    // ดึงลอตเตอรี่ทั้งหมด
    const lotteries = await prisma.lottery.findMany();

    // กรองข้อมูลลอตเตอรี่ที่เปิดอยู่
    const activeLotteries = lotteries.filter((lottery) => {
      const openDays = lottery.openDays; // ค่านี้เป็น JSON
      return (
        Array.isArray(openDays) &&
        openDays.includes(currentDay) && // ตรวจสอบวัน
        lottery.openTime <= currentTime && // ตรวจสอบเวลาเปิด
        lottery.closeTime >= currentTime   // ตรวจสอบเวลาปิด
      );
    });

    const targetName = "Lotto A"; // ชื่อที่ต้องการค้นหา
    const exists = activeLotteries.some((lottery) => lottery.name === targetName);

    if (exists) {
      console.log(`มีลอตเตอรี่ชื่อ ${targetName} ในรายการ activeLotteries`);
    } else {
      console.log(`ไม่มีลอตเตอรี่ชื่อ ${targetName} ในรายการ activeLotteries`);
    }

    res.status(200).json({ activeLotteries });
  } catch (error) {
    console.error("Error fetching active lotteries:", error);
    res.status(500).json({ error: "Error fetching active lotteries" });
  }
};