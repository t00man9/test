// import
const express = require("express");
const router = express.Router();

const { addResult, listResult } = require("../controllers/result");
const { authCheck, adminCheck } = require("../middlewares/authCheck");

router.post("/result", addResult, authCheck, adminCheck);
router.get("/result", listResult);

module.exports = router;
