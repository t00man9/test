const express = require("express");
const router = express.Router();
const { authCheck, adminCheck } = require("../middlewares/authCheck");
const {
  createLottery,
  getAllLotteries,
  updateSystemStatus,
  getLotteries,
  createOrUpdateLottery,
} = require("../controllers/Loto");

// เส้นทางสำหรับสร้าง Lottery (POST)
router.post("/totteries", authCheck, adminCheck, createLottery);

// เส้นทางสำหรับดึงรายการ Lottery ทั้งหมด (GET)
router.get("/totteries", authCheck, adminCheck, getLotteries);

// เส้นทางสำหรับอัปเดตสถานะ Lottery (PATCH)
router.patch("/totteries/:id", authCheck, adminCheck, updateSystemStatus);

module.exports = router;
