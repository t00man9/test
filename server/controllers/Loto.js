const prisma = require("../config/prisma");
const { PrismaClient } = require("@prisma/client");

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
    const { name, openDate, closeDate, openDays, autoOpenNext } = req.body;

    const newLottery = await prisma.lottery.create({
      data: {
        name,
        openDate: new Date(openDate),
        closeDate: new Date(closeDate),
        openDays,
        autoOpenNext,
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
