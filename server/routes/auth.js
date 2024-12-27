// import
const express = require("express");
const router = express.Router();
const multer = require("multer");
// import controller
const {
  register,
  login,
  currentUser,
  createTopUp,
  getAllTopUps,
  approveTopUp,
  rejectTopUp,
  getImage,
  getUsers,
  updateUserCredit
} = require("../controllers/auth");
const { authCheck, adminCheck,masterCheck } = require("../middlewares/authCheck");

router.post("/register", register);
router.get("/user", getUsers);
router.post("/login", login);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentUser);
router.put("/users/:userId/update-credit", authCheck, updateUserCredit,);
// Routes
// กำหนดตำแหน่งเก็บสลิป

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/slips/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });
router.post(
  "/create",
  upload.single("slip"),
  createTopUp,
  authCheck,
  currentUser
);
router.get("/admin/all", getAllTopUps, authCheck, adminCheck, currentUser);
router.put(
  "/admin/approve/:topUpId",
  approveTopUp,
  authCheck,
  adminCheck,
  currentUser
);
router.put(
  "/admin/reject/:topUpId",
  rejectTopUp,
  authCheck,
  adminCheck,
  currentUser
);
router.get("/image/:topUpId", getImage, authCheck, adminCheck, currentUser);

module.exports = router;
