const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

exports.authCheck = async (req, res, next) => {
  try {
    //code
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return res.status(401).json({ message: "No Token, Authorization" });
    }
    const token = headerToken.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode;

    const user = await prisma.user.findFirst({
      where: {
        numberCall: req.user.numberCall,
      },
    });
    if (!user.enabled) {
      return res.status(400).json({ message: "This account cannot access" });
    }

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Token Invalid" });
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const { numberCall } = req.user;
    const adminUser = await prisma.user.findFirst({
      where: { numberCall: numberCall },
    });
    console.log("adminUser", adminUser);

    // ตรวจสอบว่าเป็นผู้ใช้ที่มี role "admin" หรือ "master"
    if (
      !adminUser ||
      !(adminUser.role === "admin" || adminUser.role === "master")
    ) {
      return res.status(403).json({ message: "Access Denied: Admin Only" });
    }

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error Admin access denied" });
  }
};

exports.masterCheck = async (req, res, next) => {
  try {
    const { numberCall } = req.user;
    const masterCheck = await prisma.user.findFirst({
      where: { numberCall: numberCall },
    });
    if (!masterCheck || masterCheck.role !== "master") {
      return res.status(403).json({ message: "Acess Denied: Admin Only" });
    }
    // console.log('admin check', adminUser)
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error Admin access denied" });
  }
};
