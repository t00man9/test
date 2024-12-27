const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.checkAndCreateDefaultUser = async () => {
  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      console.log("No users found. Creating default user...");
      const defaultPassword = "master123";
      const hashPassword = await bcrypt.hash(defaultPassword, 10);

      await prisma.user.create({
        data: {
          numberCall: "master", // ตั้งชื่อหรือหมายเลข default
          password: hashPassword,
          role: "master", // หรือกำหนด role ตามต้องการ
        },
      });

      console.log("Default user created successfully.");
    } else {
      console.log("Users already exist. No action needed.");
    }
  } catch (err) {
    console.error("Error while checking or creating default user:", err);
  }
};

exports.register = async (req, res) => {
  try {
    const { numberCall, password, role } = req.body;

    //step1
    if (!numberCall || !password) {
      return res.status(400).json({ message: " Is'not require" });
    }
    //step2
    const user = await prisma.user.findFirst({
      where: {
        numberCall: numberCall,
      },
    });
    let roles = "";

    if (!role) {
      roles = "user";
    } else {
      roles = role;
    }

    if (user) {
      return res.status(400).json({ message: "numberCall already sexits!!" });
    }
    // step 3 HashPassword
    const hashPassword = await bcrypt.hash(password, 10);

    // step 4 register
    await prisma.user.create({
      data: {
        numberCall: numberCall,
        password: hashPassword,
        role: roles,
      },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          numberCall: "master",
          password: "master123",
          role: "master",
        },
      });
      console.log("God is coming");
    }

    res.send("Register Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        numberCall: true,
        role: true,
        credit: true,
      },
    });

    res.status(200).json(users);
  } catch (err) {
    console.log("Error fetching users:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { numberCall, password } = req.body;
    //step 1 Check numberCall
    const user = await prisma.user.findFirst({
      where: {
        numberCall: numberCall,
      },
    });
    if (!user || !user.enabled) {
      return res.status(400).json({ message: "User not Found or not Enabled" });
    }
    //Step 2 Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password Invalid!!!!" });
    }
    //Step 3 Create Payload
    const payload = {
      id: user.id,
      numberCall: user.numberCall,
      role: user.role,
      credit: user.credit,
      name: user.name,
      role: user.role,
    };
    //Step 4 Generate Token
    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Server is Error" });
      }
      res.json({ payload, token });
    });
    console.log(payload);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { numberCall: req.user.numbercall },
      select: {
        id: true,
        numberCall: true,
        name: true,
        credit: true,
        role: true,
      },
    });
    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUserCredit = async (req, res) => {
  const { userId } = req.params; // ดึง userId จาก params
  const { credit } = req.body; // ดึงเครดิตใหม่จาก body

  // ตรวจสอบว่าเครดิตใหม่เป็นตัวเลขและไม่ต่ำกว่า 0
  if (isNaN(credit) || credit < 0) {
    return res.status(400).json({ message: "เครดิตไม่ถูกต้อง" });
  }

  try {
    // แปลง userId เป็น Int
    const userIdInt = parseInt(userId);

    // ตรวจสอบว่า userId เป็นตัวเลขที่ถูกต้อง
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: "ID ผู้ใช้ไม่ถูกต้อง" });
    }

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { id: userIdInt }, // ใช้ userIdInt ซึ่งเป็น Int
    });

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    // อัปเดตเครดิต
    const updatedUser = await prisma.user.update({
      where: { id: userIdInt }, // ใช้ userIdInt ซึ่งเป็น Int
      data: { credit }, // อัปเดตเครดิต
    });

    return res
      .status(200)
      .json({ message: "อัปเดตเครดิตสำเร็จ", user: updatedUser });
  } catch (err) {
    console.error("Error updating credit:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตเครดิต" });
  }
};

// exports.create = async (req, res) => {
//   try {
//     const { numberCall, numbers, gameType, betType, amount } = req.body; // ใช้ numbers แทน number

//     // ค้นหาผู้ใช้ตาม numberCall
//     const user = await prisma.user.findFirst({
//       where: {
//         numberCall: numberCall,
//       },
//     });

//     // ตรวจสอบว่าพบผู้ใช้หรือไม่
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // สร้าง Bet สำหรับแต่ละหมายเลขใน numbers
//     const category = await prisma.bet.createMany({
//       data: numbers.map((num) => ({
//         userId: user.id, // ใช้ userId แทนการเชื่อมโยงกับ user
//         gameType: gameType,
//         number: num.number, // ใช้หมายเลขจาก numbers
//         betType: betType,
//         amount: parseFloat(num.amount), // แปลง amount ที่แยกตามหมายเลข
//       })),
//     });

//     return res.json(category); // ส่งกลับข้อมูลที่สร้างใหม่
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

exports.create = async (req, res) => {
  try {
    const { numberCall, numbers } = req.body;

    // ค้นหาผู้ใช้ตาม numberCall
    const user = await prisma.user.findFirst({
      where: {
        numberCall: numberCall,
      },
    });

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // สร้าง Bet สำหรับแต่ละหมายเลขใน numbers
    const bets = await prisma.bet.createMany({
      data: numbers.map((num) => ({
        userId: user.id, // เชื่อมโยงกับ user ผ่าน userId
        groupLotto: num.groupLotto,
        number: num.number, // ดึงหมายเลขจาก numbers
        gameType: num.gameType, // ดึง gameType จาก numbers
        amount: num.amount, // แปลง amount ที่ส่งมา
      })),
    });

    return res.json({ success: true, bets }); // ส่งกลับข้อมูลที่สร้างใหม่
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.list = async (req, res) => {
  try {
    const { userId } = req.params; // รับ userId จาก URL

    // ตรวจสอบว่า userId เป็นตัวเลขก่อนที่จะส่งไป Prisma
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // ดึงข้อมูล Bet จากฐานข้อมูล
    const bets = await prisma.bet.findMany({
      where: {
        userId: parseInt(userId), // แปลง userId เป็นตัวเลข
      },
      include: {
        user: true,
      },
    });

    // ส่งข้อมูลออกไป
    res.status(200).json({ success: true, bets });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.remove = async (req, res) => {
  try {
    res.send("Hello remove In Controller");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// สร้างคำขอเติมเงิน
exports.createTopUp = async (req, res) => {
  const { userId, amount } = req.body;

  console.log("Flie", req.file.filename);

  if (!amount || !userId) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const newTopUp = await prisma.topUp.create({
      data: {
        userId: parseInt(userId),
        amount: parseFloat(amount),
        slipUrl: req.file.filename,
        status: "PENDING",
      },
    });
    console.log("newTopUp", newTopUp);

    res.status(201).json({ message: "ส่งคำขอเติมเงินสำเร็จ", topUp: newTopUp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกคำขอ" });
  }
};

// ดึงคำขอเติมเงินทั้งหมด (สำหรับแอดมิน)
exports.getAllTopUps = async (req, res) => {
  try {
    const topUps = await prisma.topUp.findMany({
      where: {
        status: "PENDING",
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(topUps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลได้" });
  }
};

// ฟังก์ชันสำหรับดึงไฟล์รูปภาพจากฐานข้อมูล
exports.getImage = async (req, res) => {
  const { topUpId } = req.params;
  try {
    // หาไฟล์จากฐานข้อมูลหรือที่เก็บไฟล์
    const imagePath = path.join(__dirname, "uploads", `${topUpId}.jpg`); // สมมุติว่าไฟล์เก็บที่ uploads/

    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath); // อ่านไฟล์

      // กำหนด Content-Type
      res.setHeader("Content-Type", "image/jpeg");
      res.send(imageBuffer); // ส่งข้อมูลไฟล์
    } else {
      res.status(404).json({ message: "ไม่พบไฟล์" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงไฟล์" });
  }
};

// อนุมัติคำขอเติมเงิน
exports.approveTopUp = async (req, res) => {
  const { topUpId } = req.params;
  console.log("topUpId", topUpId);
  console.log("params", req.params);

  try {
    const topUp = await prisma.topUp.findUnique({
      where: { id: parseInt(topUpId) },
    });

    if (!topUp || topUp.status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "คำขอไม่ถูกต้องหรืออนุมัติไปแล้ว" });
    }

    // เพิ่มเครดิตให้ผู้ใช้
    await prisma.user.update({
      where: { id: topUp.userId },
      data: {
        credit: { increment: topUp.amount },
      },
    });

    // อัปเดตสถานะคำขอเป็น "APPROVED"
    const updatedTopUp = await prisma.topUp.update({
      where: { id: parseInt(topUpId) },
      data: { status: "APPROVED" },
    });

    res.status(200).json({ message: "อนุมัติคำขอสำเร็จ", topUp: updatedTopUp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอนุมัติ" });
  }
};

// ปฏิเสธคำขอเติมเงิน
exports.rejectTopUp = async (req, res) => {
  const { topUpId } = req.params;

  try {
    const updatedTopUp = await prisma.topUp.update({
      where: { id: parseInt(topUpId) },
      data: { status: "REJECTED" },
    });

    res.status(200).json({ message: "ปฏิเสธคำขอสำเร็จ", topUp: updatedTopUp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการปฏิเสธ" });
  }
};
