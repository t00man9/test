const prisma = require("../config/prisma");

// exports.addResult = async (req, res) => {
//   try {
//     const { lotteryName, winningNumber, openDate, closeDate, round } = req.body;

//     // ตรวจสอบให้แน่ใจว่า `round` และ `date` ถูกส่งมาด้วย
//     if (!round || !openDate || !closeDate) {
//       return res
//         .status(400)
//         .json({ error: "Round, openDate, and closeDate are required" });
//     }

//     // แปลง `openDate` และ `closeDate` ให้เป็น DateTime format
//     const newResult = await prisma.result.create({
//       data: {
//         lotteryName,
//         winningNumber,
//         round: round, // ต้องส่งค่า `round` ในที่นี้
//         date: new Date(openDate), // กำหนด `date` โดยใช้ `openDate`
//       },
//     });

//     res.json(newResult);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };
exports.addResult = async (req, res) => {
  try {
    const {
      lotteryName,
      winningNumber,
      threeDigit,
      twoDigit,
      twoDigitLower,
      round,
    } = req.body;

    // บันทึกผลรางวัลลงในฐานข้อมูล
    const result = await prisma.result.create({
      data: {
        lotteryName: lotteryName,
        winningNumber: winningNumber,
        threeDigit: threeDigit,
        twoDigit: twoDigit,
        twoDigitLower: twoDigitLower,
        round: parseInt(round), // Ensure the round is passed and parsed correctly
        date: new Date(),
      },
    });

    // ส่งผลลัพธ์กลับไปยัง client
    res.json({ message: "Result added successfully", data: result });
  } catch (error) {
    console.error("Error while adding result:", error);
    res.status(500).json({ error: "Failed to add result" });
  }
};

exports.listResult = async (req, res) => {
  // GET - ดึงข้อมูลทั้งหมด
  try {
    const result = await prisma.result.findMany();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
