// Import
const express = require("express");
const router = express.Router();
const { create, list, remove } = require("../controllers/auth");
const { authCheck, adminCheck } = require("../middlewares/authCheck");

router.post("/category", create, authCheck, adminCheck);
router.get("/category/:userId", list, authCheck, adminCheck);
router.delete("/category/:id", remove, authCheck, adminCheck);

module.exports = router;
