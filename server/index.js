// Import
const express = require("express");
const cors = require("cors");
const { readdirSync } = require("fs");
const schedule = require("node-schedule");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cron = require("node-cron");
const { checkAndCreateDefaultUser } = require("./controllers/auth");
const { updateLotteryStatus } = require("./controllers/Loto");
// สร้าง express app
const app = express();

// ใช้ middleware
app.use(cors());
app.use(express.json());

// โหลด routes จากไฟล์ในโฟลเดอร์ routes
readdirSync("./routes").map((route) =>
  app.use("/api", require("./routes/" + route))
);

// รันทุกนาทีเพื่อตรวจสอบสถานะหวย
// cron.schedule("* * * * *", async () => {
//   console.log("Checking lottery status...");
//   await updateLotteryStatus();
// });

// Start server
app.listen(3001, async () => {
  await checkAndCreateDefaultUser();
  console.log("Server is running on port 3001");
});

// ปิดการเชื่อมต่อ Prisma เมื่อ server ปิด
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from Prisma");
  process.exit(0);
});
