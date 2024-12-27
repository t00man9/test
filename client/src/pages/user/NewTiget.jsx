import { Pencil, ReceiptText, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { createTiget } from "../../api/Tiget";
import { useLocation } from "react-router-dom";
import useTigetStore from "../../store/tiget.store";
import { toast } from "react-toastify";

const NewTiget = () => {
  const token = useTigetStore((s) => s.token);
  const userInfo = useTigetStore((s) => s.numberCall);

  // ModelList ใส่ราคา
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ModelS เลือก กดเลข เลือกจากแผง จับ วิน
  const [isSelect, setIsSelect] = useState("MANUAL");

  // if เมื่อกด
  const [showDiv, setShowDiv] = useState(false);
  const [selectedType, setSelectedType] = useState(""); // เก็บประเภทที่เลือก
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null); // เก็บกลุ่มที่เลือกในปัจจุบัน
  const [isType, setIsType] = useState("");

  // Path
  // ดึง path ทั้งหมดจาก URL
  const queryParams = new URLSearchParams(location.search);
  const group = queryParams.get("group"); // ดึงค่า 'group'

  const handleClick = (type, group) => {
    console.log("isType", isType);

    if (activeGroup && activeGroup !== group) {
      // ถ้าเปลี่ยนกลุ่ม ล้างตัวเลือกทั้งหมดแล้วเริ่มใหม่
      setSelectedTypes([type]);
      setActiveGroup(group);
    } else {
      // ถ้ากดในกลุ่มเดิม
      setActiveGroup(group);
      setSelectedTypes(
        (prev) =>
          prev.includes(type)
            ? prev.filter((t) => t !== type) // ถ้ากดซ้ำ ให้ถอดออก
            : [...prev, type] // ถ้ายังไม่ได้กด ให้เพิ่ม
      );
    }

    // แสดง/ซ่อนฟิลด์เพิ่มเติมตามประเภท
    if (type === "2 ตัวบน" || type === "2 ตัวล่าง" || type === "2 ตัวกลับ") {
      setShowDiv(true);
    } else {
      setShowDiv(false);
    }

    setSelectedType(type); // อัปเดตประเภทที่เลือก
  };
  useEffect(() => {
    console.log("isType changed:", isType);
  }, [isType]);

  // ใส่ตัวเลข
  const [inputValue, setInputValue] = useState("");
  const handleKeyClick = (key) => {
    if (key === "ลบ") {
      // ลบตัวอักษรตัวสุดท้าย
      setInputValue((prev) => prev.slice(0, -1));
    } else if (key === "ล้าง") {
      // ล้างค่าทั้งหมด
      setInputValue("");
    } else {
      // เพิ่มตัวเลขลงใน state
      setInputValue((prev) => prev + key.toString());
    }
    console.log("inputValue", inputValue);
  };

  // ที่ต้องการ 2 ตัว บนล่าง
  const [checkType, setCheckType] = useState("");
  const [numberArray, setNumberArray] = useState([]); // สร้าง state สำหรับเก็บเลข
  // const twoDigitHigh = () => {
  //   const numbers = [];
  //   for (let i = 50; i <= 99; i++) {
  //     // ใช้ padStart เพื่อให้มีสองหลัก
  //     const formattedNumber = String(i).padStart(2, "0");
  //     numbers.push(formattedNumber);
  //     console.log(numbers);
  //   }
  //   setNumberArray((prev) => {
  //     const newArray = [...prev, ...numbers];
  //     // setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
  //     return newArray;
  //   });
  //   console.log("numbersHigh", numbers);
  // };

  const twoDigitHigh = () => {
    const numbers = [];
    for (let i = 50; i <= 99; i++) {
      // ใช้ padStart เพื่อให้ตัวเลขมีสองหลัก
      const formattedNumber = String(i).padStart(2, "0");
      numbers.push(formattedNumber);
    }

    console.log("numbersHigh", numbers);

    // ตรวจสอบว่ามี selectedTypes หรือไม่
    if (selectedTypes.length === 0) {
      console.error(
        "No selected types found. Please select at least one type."
      );
      return;
    }

    const grouplotto = "หวยรัฐบาลไทย";
    const amount = 1;

    // สร้าง newBets โดยแยกแต่ละตัวเลขเป็นชุด
    const newBets = numbers.flatMap((number) =>
      selectedTypes.map((type) => ({
        type,
        numbers: number, // ใส่เลขเป็นตัวเดี่ยว
        grouplotto,
        amount,
      }))
    );

    // อัปเดต bets
    setBets((prevBets) => [...prevBets, ...newBets]);

    // อัปเดต numberArray (ถ้าจำเป็น)
    setNumberArray((prev) => [...prev, ...numbers]);
  };

  const swipeFace = () => {
    const results = [];

    for (let i = 0; i <= 9; i++) {
      results.push(`${value}${i}`);
    }
    setNumberArray((prev) => {
      const newArray = [...prev, ...results];
      // setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
      return newArray;
    });
  };

  const swipeBack = () => {
    const results = [];

    for (let i = 0; i <= 9; i++) {
      results.push(`${i}${value}`);
    }
    setNumberArray((prev) => {
      const newArray = [...prev, ...results];
      // setAmount(newArray.length); // อัปเดต amount ตามจำนวนใน array
      return newArray;
    });
  };

  const twoDigitLow = () => {
    const numbers = [];
    for (let i = 0; i < 50; i++) {
      // ใช้ padStart เพื่อให้ตัวเลขมีสองหลัก
      const formattedNumber = String(i).padStart(2, "0");
      numbers.push(formattedNumber);
    }
    // ตรวจสอบว่ามี selectedTypes หรือไม่
    if (selectedTypes.length === 0) {
      console.error(
        "No selected types found. Please select at least one type."
      );
      return;
    }
    const grouplotto = "หวยรัฐบาลไทย";
    const amount = 1;

    // สร้าง newBets โดยแยกแต่ละตัวเลขเป็นชุด
    const newBets = numbers.flatMap((number) =>
      selectedTypes.map((type) => ({
        type,
        numbers: number, // ใส่เลขเป็นตัวเดี่ยว
        grouplotto,
        amount,
      }))
    );
    // อัปเดต bets
    setBets((prevBets) => [...prevBets, ...newBets]);
    // อัปเดต numberArray (ถ้าจำเป็น)
    setNumberArray((prev) => [...prev, ...numbers]);
  };

  const twoDigitEven = () => {
    const evenNumbers = [];
    for (let i = 0; i <= 99; i++) {
      if (i % 2 === 0) {
        // ใช้ padStart เพื่อให้มี 2 หลัก
        evenNumbers.push(i.toString().padStart(2, "0"));
      }
    }
    // ตรวจสอบว่ามี selectedTypes หรือไม่
    if (selectedTypes.length === 0) {
      console.error(
        "No selected types found. Please select at least one type."
      );
      return;
    }
    const grouplotto = "หวยรัฐบาลไทย";
    const amount = 1;
    // สร้าง newBets โดยแยกแต่ละตัวเลขเป็นชุด
    const newBets = evenNumbers.flatMap((number) =>
      selectedTypes.map((type) => ({
        type,
        numbers: number, // ใส่เลขเป็นตัวเดี่ยว
        grouplotto,
        amount,
      }))
    );
    // อัปเดต bets
    setBets((prevBets) => [...prevBets, ...newBets]);

    // อัปเดต numberArray (ถ้าจำเป็น)
    setNumberArray((prev) => [...prev, ...evenNumbers]);
    console.log("evenNumbers", evenNumbers);
  };

  const twoDigitOdd = () => {
    const oddNumbers = [];
    for (let i = 0; i <= 99; i++) {
      if (i % 2 !== 0) {
        // ตรวจสอบว่าเป็นเลขคี่
        oddNumbers.push(i < 10 ? `0${i}` : i.toString()); // เพิ่มเลขในรูปแบบ 00, 01, ...
      }
    }

    // ตรวจสอบว่ามี selectedTypes หรือไม่
    if (selectedTypes.length === 0) {
      console.error(
        "No selected types found. Please select at least one type."
      );
      return;
    }
    const grouplotto = "หวยรัฐบาลไทย";
    const amount = 1;
    // สร้าง newBets โดยแยกแต่ละตัวเลขเป็นชุด
    const newBets = oddNumbers.flatMap((number) =>
      selectedTypes.map((type) => ({
        type,
        numbers: number, // ใส่เลขเป็นตัวเดี่ยว
        grouplotto,
        amount,
      }))
    );
    // อัปเดต bets
    setBets((prevBets) => [...prevBets, ...newBets]);

    // อัปเดต numberArray (ถ้าจำเป็น)
    setNumberArray((prev) => [...prev, ...oddNumbers]);
    console.log("oddNumbers", oddNumbers);
  };

  const twoDigitDouble = () => {
    const doubleNumbers = [];
    for (let i = 0; i <= 9; i++) {
      const doubleNumber = `${i}${i}`; // สร้างเลขเบิ้ล
      doubleNumbers.push(doubleNumber);
    }

    if (selectedTypes.length === 0) {
      console.error(
        "No selected types found. Please select at least one type."
      );
      return;
    }
    const grouplotto = "หวยรัฐบาลไทย";
    const amount = 1;
    // สร้าง newBets โดยแยกแต่ละตัวเลขเป็นชุด
    const newBets = doubleNumbers.flatMap((number) =>
      selectedTypes.map((type) => ({
        type,
        numbers: number, // ใส่เลขเป็นตัวเดี่ยว
        grouplotto,
        amount,
      }))
    );
    // อัปเดต bets
    setBets((prevBets) => [...prevBets, ...newBets]);

    // อัปเดต numberArray (ถ้าจำเป็น)
    setNumberArray((prev) => [...prev, ...doubleNumbers]);
  };

  const generatePermutations = (numbers) => {
    const results = new Set();

    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        results.add(m.join(""));
      } else {
        for (let i = 0; i < arr.length; i++) {
          const current = arr.slice();
          const next = current.splice(i, 1);
          permute(current, m.concat(next));
        }
      }
    };
  };

  // Data
  const buttonData = [
    { label: "3 ตัวบน", type: "3 ตัวบน", group: "groupA" },
    { label: "3 ตัวโต๊ด", type: "3 ตัวโต๊ด", group: "groupA" },
    { label: "3 ตัวหน้า", type: "3 ตัวหน้า", group: "groupA" },
    { label: "3 ตัวหลัง", type: "3 ตัวหลัง", group: "groupA" },
    { label: "3 ตัวล่าง", type: "3 ตัวล่าง", group: "groupA" },
    { label: "2 ตัวบน", type: "2 ตัวบน", group: "groupB" },
    { label: "2 ตัวล่าง", type: "2 ตัวล่าง", group: "groupB" },
    { label: "วิ่งบน", type: "วิ่งบน", group: "groupC" },
    { label: "วิ่งล่าง", type: "วิ่งล่าง", group: "groupC" },
    { label: "2 ตัวกลับ", type: "2 ตัวกลับ", group: "groupB" },
    { label: "3 ตัวกลับ", type: "3 ตัวกลับ", group: "groupA" },
  ];

  // เงื่อนไข
  const conditions = [
    {
      type: "3 ตัวบน",
      pay: 1000,
      min: 1,
      max: 500,
    },
    {
      type: "3 ตัวล่าง",
      pay: 450,
      min: 1,
      max: 100,
    },
    {
      type: "3 ตัวหน้า",
      pay: 450,
      min: 1,
      max: 100,
    },
    {
      type: "3 ตัวโต๊ด",
      pay: 150,
      min: 1,
      max: 500,
    },
    {
      type: "2 ตัวบน",
      pay: 100,
      min: 1,
      max: 2000,
    },
    {
      type: "2 ตัวล่าง",
      pay: 100,
      min: 1,
      max: 2000,
    },
    {
      type: "วิ่งบน",
      pay: 3.2,
      min: 1,
      max: 10000,
    },
    {
      type: "วิ่งล่าง",
      pay: 4.2,
      min: 1,
      max: 10000,
    },
  ];

  // input เลข
  const [inputs, setInputs] = useState(["", "", ""]); // ช่องกรอกตัวเลข (3 ช่องสำหรับ 3 ตัว)
  const [bets, setBets] = useState([]); // เก็บรายการที่แทง
  const [isselectedTypes, setIsSelectedTypes] = useState([]); // เก็บประเภทที่เลือกหลายตัว

  // const handleChange = (value, index) => {
  //   // อนุญาตเฉพาะตัวเลข
  //   if (!/^\d?$/.test(value)) return;

  //   // อัปเดตค่าในช่อง input
  //   const newInputs = [...inputs];
  //   newInputs[index] = value;
  //   setInputs(newInputs);

  //   // ย้ายไปช่องถัดไปถ้ายังไม่ใช่ช่องสุดท้าย
  //   if (value && index < inputs.length - 1) {
  //     document.getElementById(`input-${index + 1}`).focus();
  //   }

  //   // ถ้ากรอกครบทุกช่องแล้ว
  //   if (newInputs.every((num) => num !== "")) {
  //     const numbers = newInputs.join(""); // รวมตัวเลข
  //     setBets((prevBets) => [
  //       ...prevBets,
  //       { type, numbers, amount: 1 }, // เพิ่มข้อมูลลงในรายการที่แทง
  //     ]);
  //     setInputs(["", "", ""]); // เคลียร์ช่องกรอก
  //   }
  // };
  // const handleChange = (value, index) => {
  //   // อนุญาตเฉพาะตัวเลข
  //   if (!/^\d?$/.test(value)) return;

  //   // อัปเดตค่าในช่อง input
  //   const newInputs = [...inputs];
  //   newInputs[index] = value;
  //   setInputs(newInputs);

  //   // ย้ายไปช่องถัดไปถ้ายังไม่ใช่ช่องสุดท้าย
  //   if (value && index < inputs.length - 1) {
  //     document.getElementById(`input-${index + 1}`).focus();
  //   }

  //   // ถ้ากรอกครบทุกช่องแล้ว
  //   if (newInputs.every((num) => num !== "")) {
  //     const numbers = newInputs.join(""); // รวมตัวเลข
  //     const generatedBets = generateBets(type, numbers); // สร้างเลขตามประเภท
  //     setBets((prevBets) => [...prevBets, ...generatedBets]); // เพิ่มข้อมูลหลายรายการในครั้งเดียว
  //     setInputs(["", "", ""]); // เคลียร์ช่องกรอก
  //   }
  // };
  useEffect(() => {
    if (
      selectedType === "2 ตัวบน" ||
      selectedType === "2 ตัวล่าง" ||
      selectedType === "2 ตัวกลับ"
    ) {
      setInputs(["", ""]); // กำหนด input สำหรับ 2 ตัว
    } else if (
      selectedType === "3 ตัวบน" ||
      selectedType === "3 ตัวหน้า" ||
      selectedType === "3 ตัวกลับ" ||
      selectedType === "3 ตัวโต๊ด"
    ) {
      setInputs(["", "", ""]); // กำหนด input สำหรับ 3 ตัว
    } else {
      setInputs([""]); // กำหนด input สำหรับ  1 ตัว
    }
  }, [selectedType]); // อัปเดตเมื่อ selectedType เปลี่ยน

  // const handleChange = (value, index) => {
  //   if (!/^\d?$/.test(value)) return; // อนุญาตเฉพาะตัวเลข

  //   const newInputs = [...inputs];
  //   newInputs[index] = value;
  //   setInputs(newInputs);

  //   // ย้ายไปช่องถัดไปถ้ายังไม่ใช่ช่องสุดท้าย
  //   if (value && index < inputs.length - 1) {
  //     document.getElementById(`input-${index + 1}`).focus();
  //   }

  //   // ถ้ากรอกครบทุกช่องแล้ว
  //   if (newInputs.every((num) => num !== "")) {
  //     const numbers = newInputs.join(""); // รวมตัวเลขจากช่องกรอก
  //     const newBets = selectedTypes.map((type) => ({
  //       type, // เพิ่มข้อมูลตาม type ที่เลือกไว้
  //       numbers,
  //       amount: 1,
  //     })); // สร้างข้อมูลแทงสำหรับทุก type ที่เลือก

  //     setBets((prevBets) => [...prevBets, ...newBets]); // เพิ่มข้อมูลทั้งหมดใน bets
  //     setInputs(["", "", ""]); // รีเซ็ตช่องกรอก
  //   }
  // };

  // ลบรายการ

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // อนุญาตเฉพาะตัวเลข

    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    // ย้ายไปช่องถัดไปถ้ายังไม่ใช่ช่องสุดท้าย
    // if (value && index < inputs.length - 1) {
    //   document.getElementById(`input-${index + 1}`).focus();
    // }
    if (value) {
      if (index < inputs.length - 1) {
        // ไปช่องถัดไป
        document.getElementById(`input-${index + 1}`).focus();
      } else {
        // ถ้าเป็นช่องสุดท้าย ให้กลับไปช่องแรก
        document.getElementById(`input-0`).focus();
      }
    }

    // ถ้ากรอกครบทุกช่องแล้ว
    if (newInputs.every((num) => num !== "")) {
      const numbers = newInputs.join(""); // รวมตัวเลขจากช่องกรอก
      const newBets = selectedTypes.map((type) => ({
        type,
        numbers,
        grouplotto: group,
        amount: 1,
      })); // เพิ่มข้อมูลสำหรับทุกประเภทที่เลือก

      setBets((prevBets) => [...prevBets, ...newBets]); // เพิ่มข้อมูลใน bets
      setInputs(
        selectedType === "2 ตัวบน" ||
          selectedType === "2 ตัวล่าง" ||
          selectedType === "2 ตัวกลับ"
          ? ["", ""] // เคลียร์ช่องกรอกสำหรับ 2 ตัว
          : ["", "", ""] // เคลียร์ช่องกรอกสำหรับ 3 ตัว
      );
    }
  };

  // ต่างๆ
  const [selectedBet, setSelectedBet] = useState(null); // เก็บรายการที่ต้องการลบ
  const [modalData, setModalData] = useState(null);
  const removeBet = (index) => {
    setBets((prevBets) => prevBets.filter((_, i) => i !== index));
  };
  const [credit, setCredit] = useState(1000);
  const [inputNumber, setInputNumber] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [editAmount, setEditAmount] = useState(bets.map((bet) => bet.amount));

  useEffect(() => {
    setEditAmount(bets.map((bet) => bet.amount));
  }, [bets]);
  // ฟังก์ชันที่อัพเดทราคาใน local state

  // const handleAmountChange = (index, value) => {
  //   const updatedBets = [...bets]; // ทำสำเนาของ array
  //   updatedBets[index].amount = parseFloat(value); // อัปเดตค่า amount ที่ตำแหน่ง index
  //   setBets(updatedBets); // อัปเดต state
  // };
  const handleAmountChange = (index, value) => {
    console.log("Before Update:", bets);
    const updatedBets = [...bets];
    updatedBets[index].amount = parseFloat(value);
    console.log("After Update:", updatedBets);
    setBets(updatedBets);
  };

  // ฟังก์ชันที่ส่งข้อมูลเมื่อกดส่งโพย
  const handleSubmitBets = () => {
    const updatedBets = bets.map((bet, index) => ({
      ...bet,
      amount: editAmount[index] || bet.amount, // ถ้าไม่มีการแก้ไขให้ใช้ค่าปัจจุบัน
    }));

    submitBets(updatedBets); // ส่งข้อมูลไป backend
    closeModal(); // ปิด modal
  };

  // ฟังก์ชันลบรายการแทง
  const handleRemoveBet = (index) => {
    removeBet(index); // ลบรายการจาก bets
    setEditAmount((prevState) => {
      const newEditAmount = { ...prevState };
      delete newEditAmount[index]; // ลบการแก้ไขราคาออกจาก editAmount ด้วย
      return newEditAmount;
    });
  };

  const addBet = () => {
    if (!inputNumber || !inputAmount) return;

    const newBet = {
      id: bets.length + 1,
      number: inputNumber,
      amount: parseFloat(inputAmount),
      rate: 1000, // ตัวอย่างเรทจ่าย
    };

    setBets([...bets, newBet]);
    setInputNumber("");
    setInputAmount("");
  };

  const deleteBet = (id) => {
    setBets(bets.filter((bet) => bet.id !== id));
  };

  const calculateTotal = () => {
    return bets.reduce((total, bet, index) => {
      const amount =
        editAmount[index] !== undefined ? editAmount[index] : bet.amount;
      return total + Number(amount);
    }, 0);
  };

  const addQuickAmount = (amount) => {
    setInputAmount((prev) => (prev ? parseFloat(prev) + amount : amount));
  };

  const submitBets = () => {
    // ส่งข้อมูลไป backend
    console.log("Submit Bets:", bets);
  };

  const clearAll = () => {
    setBets([]);
  };

  // ส่งโพย
  const [gameType, setGameType] = useState("3 ตัว");
  const [betType, setBetType] = useState("บน");
  console.log(999, bets);

  const handleSunmit = async (e) => {
    e.preventDefault();
    if (!gameType || !betType) {
      toast.error("กรุณาเลือกประเภทการเล่นและประเภทการเดิมพัน");
      return;
    }
    try {
      const res = await createTiget(token, {
        numberCall: userInfo.numberCall,
        numbers: bets.map((bet) => ({
          number: bet.numbers,
          groupLotto: bet.grouplotto,
          amount: bet.amount,
          gameType: bet.type,
        })),
      });
      console.log("Betsetting", res);

      toast.success(`แทงสำเร็จ`);
      setNumberArray([]);
      setAmount(0); // เคลียร์ amount หลังแทงสำเร็จ

      // ลบ amount ออกจาก userInfo.credit
      setUserInfo((prev) => ({
        ...prev,
        credit: prev.credit - amount,
      }));
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="home">
      <div className=" bg-gray-100 flex flex-col ">
        {/* Header */}
        <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{group}</h1>
          <div>
            <span className="mr-4">วันอาทิตย์ 01/12/67</span>
            <span className="bg-yellow-500 px-2 py-1 rounded">
              5 วัน 17:52:21
            </span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-grow">
          {/* Left Menu */}
          {/* Left Menu */}
          <aside className="w-auto bg-gray-200 p-4 flex flex-col">
            {/* ปุ่มใส่ราคา */}
            <button
              className="mb-4 bg-blue-500 p-2 rounded hover:bg-blue-600 flex items-center text-white"
              onClick={() => openModal(null)} // เปิด modal ใหม่
            >
              <Pencil className="text-white mr-2" />
              ใส่ราคา
            </button>

            {/* รายการแทง */}
            <div>
              <h1 className="p-2 rounded flex items-center font-bold text-lg mb-2">
                <ReceiptText className="mr-2" /> รายการแทง
              </h1>
              <ul className="list-disc ml-4 ">
                {Object.entries(
                  bets.reduce((groups, bet) => {
                    if (!groups[bet.type]) groups[bet.type] = [];
                    groups[bet.type].push(bet);
                    return groups;
                  }, {})
                ).map(([type, bets]) => (
                  <div key={type} className="mb-6 overflow-x-auto max-h-96">
                    {/* ชื่อประเภท */}
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">
                      {type}
                    </h3>

                    {/* ตารางของแต่ละประเภท */}
                    <table className="w-full border-collapse border">
                      <thead>
                        <tr>
                          <th className="text-sm font-medium text-gray-700 p-2 border-b">
                            #
                          </th>
                          <th className="text-sm font-medium text-gray-700 p-2 border-b">
                            เลข
                          </th>
                          <th className="text-sm font-medium text-gray-700 p-2 border-b">
                            ราคา
                          </th>

                          <th className="text-sm font-medium text-gray-700 p-2 border-b">
                            ลบ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bets.map((bet, index) => (
                          <tr key={index}>
                            <td className="p-2 text-center">{index + 1}</td>
                            <td className="p-2 text-center">{bet.numbers}</td>
                            <td className="p-2 text-center">
                              <input
                                type="number"
                                value={bet.amount}
                                onChange={(e) =>
                                  handleAmountChange(index, e.target.value)
                                } // เมื่อเปลี่ยนแปลง
                                className="w-20 p-2 border rounded-md text-center"
                                readOnly
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handleRemoveBet(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ลบ
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </ul>
            </div>
          </aside>
          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg relative w-full max-w-md md:max-w-lg lg:max-w-2xl mx-4 md:mx-auto">
                <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg md:text-2xl font-semibold text-gray-800 flex-grow text-center">
                    รายการแทง
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[75vh] p-4">
                  {/* จัดกลุ่มข้อมูลตามประเภท */}
                  {Object.entries(
                    bets.reduce((groups, bet) => {
                      if (!groups[bet.type]) groups[bet.type] = [];
                      groups[bet.type].push(bet);
                      return groups;
                    }, {})
                  ).map(([type, bets]) => (
                    <div key={type} className="mb-6">
                      {/* ชื่อประเภท */}
                      <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-700">
                        {type}
                      </h3>

                      {/* ตารางของแต่ละประเภท */}
                      <table className="w-full border-collapse border text-xs md:text-sm">
                        <thead>
                          <tr>
                            <th className="p-2 border-b">#</th>
                            <th className="p-2 border-b">เลข</th>
                            <th className="p-2 border-b">ราคา</th>
                            <th className="p-2 border-b">เรทชนะ</th>
                            <th className="p-2 border-b">ลบ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bets.map((bet, index) => {
                            // ตรวจสอบว่ามีเลขซ้ำหรือไม่
                            const isDuplicate =
                              bets.filter((b) => b.numbers === bet.numbers)
                                .length > 1;

                            return (
                              <tr
                                key={index}
                                className={isDuplicate ? "bg-red-100" : ""}
                              >
                                <td className="p-2 text-center">{index + 1}</td>
                                <td
                                  className={`p-2 text-center ${
                                    isDuplicate ? "text-red-500 font-bold" : ""
                                  }`}
                                >
                                  {bet.numbers}
                                </td>
                                <td className="p-2 text-center">
                                  <input
                                    type="number"
                                    value={bet.amount}
                                    onChange={(e) =>
                                      handleAmountChange(index, e.target.value)
                                    }
                                    className="w-16 md:w-20 p-1 md:p-2 border rounded-md text-center"
                                  />
                                </td>
                                <td className="p-2 text-center">{bet.rate}</td>
                                <td className="p-2 text-center">
                                  <button
                                    onClick={() => handleRemoveBet(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    ลบ
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}

                  <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-2">
                    <div>
                      <h3 className="text-blue-500 font-bold">
                        ยอดคงเหลือ: {credit} ฿
                      </h3>
                      <h3 className="text-red-500 font-bold">
                        รวมยอดแทง: {calculateTotal()} ฿
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={clearAll}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm md:text-base"
                      >
                        ยกเลิกทั้งหมด
                      </button>
                      <button
                        onClick={handleSunmit}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm md:text-base"
                      >
                        ส่งโพย
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Section */}
          <main className="flex-grow p-4">
            {/* Option Buttons */}
            <div className="flex gap-4 mb-4 justify-between ">
              <button
                className={`${
                  isSelect === "MANUAL" ? "bg-blue-500 " : "bg-yellow-500"
                } text-white px-4 py-2 rounded hover:text-blue-800 w-1/2 font-semibold`}
                onClick={() => {
                  setIsSelect("MANUAL");
                }}
              >
                กดเลขเอง
              </button>
              <button
                className={`${
                  isSelect === "Select" ? "bg-blue-500 " : "bg-yellow-500"
                } text-white px-4 py-2 rounded hover:text-blue-800 w-1/2 font-semibold`}
                onClick={() => {
                  setIsSelect("Select");
                }}
              >
                เลือกจากแผง
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded flex hover:text-blue-800 w-1/2 font-semibold items-center">
                ทำนายฝัน <Star />
              </button>
            </div>

            {/* Number Selection */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {buttonData.map(({ label, type, group }, index) => (
                <button
                  key={index}
                  className={`p-2 rounded border-2 ${
                    selectedTypes.includes(type)
                      ? "bg-blue-500 text-white"
                      : "border-blue-500"
                  }`}
                  onClick={() => handleClick(type, group)}
                >
                  {label}
                </button>
              ))}
            </div>
            {showDiv && (
              <div className="grid grid-cols-4 gap-4 p-4 border rounded bg-gray-200">
                <button className="p-2 rounded bg-red-500 text-white">
                  19 ประตู
                </button>
                <button
                  className="p-2 rounded bg-red-500 text-white"
                  onClick={() => {
                    twoDigitDouble();
                  }}
                >
                  เลขเบิ้ล
                </button>
                <button className="p-2 rounded bg-blue-500 text-white">
                  รูดหน้า
                </button>
                <button className="p-2 rounded bg-blue-500 text-white">
                  รูดหลัง
                </button>
                <button
                  className="p-2 rounded bg-teal-500 text-white"
                  onClick={() => {
                    twoDigitLow();
                  }}
                >
                  สองตัวต่ำ
                </button>
                <button
                  className="p-2 rounded bg-teal-500 text-white"
                  onClick={() => {
                    twoDigitHigh();
                  }}
                >
                  สองตัวสูง
                </button>
                <button
                  className="p-2 rounded bg-green-500 text-white"
                  onClick={() => {
                    twoDigitOdd();
                  }}
                >
                  สองตัวคี่
                </button>
                <button
                  className="p-2 rounded bg-green-500 text-white"
                  onClick={() => {
                    twoDigitEven();
                  }}
                >
                  สองตัวคู่
                </button>
              </div>
            )}

            {/* Input Section */}
            <div className="flex flex-col gap-4 ">
              <div className="flex flex-col gap-4 items-center mt-5 ">
                <h2 className="text-lg font-bold">รายการที่เลือก</h2>
                <div className="flex gap-2 flex-wrap justify-center text-blue-700">
                  {selectedTypes.length > 0 ? (
                    selectedTypes.map((type, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setSelectedTypes((prev) =>
                            prev.filter((t) => t !== type)
                          )
                        } // กดปุ่มเพื่อลบออก
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        {type}
                      </button>
                    ))
                  ) : (
                    <span className="text-gray-500">ยังไม่มีการเลือก</span>
                  )}
                </div>
              </div>
              {selectedType && (
                <div className="flex gap-2 justify-center">
                  {(() => {
                    if (
                      selectedType === "3 ตัวบน" ||
                      selectedType === "3 ตัวล่าง" ||
                      selectedType === "3 ตัวโต๊ด" ||
                      selectedType === "3 ตัวหน้า" ||
                      (selectedType === "3 ตัวหลัง") |
                        (selectedType === "3 ตัวกลับ")
                    ) {
                      return (
                        <>
                          {inputs.map((value, index) => (
                            <input
                              key={index}
                              id={`input-${index}`}
                              type="text"
                              maxLength={1}
                              value={value}
                              onChange={(e) =>
                                handleChange(e.target.value, index)
                              }
                              className="w-12 h-12 text-center border border-blue-300 rounded font-semibold"
                            />
                          ))}
                        </>
                      );
                    } else if (
                      selectedType === "2 ตัวบน" ||
                      selectedType === "2 ตัวล่าง" ||
                      selectedType === "2 ตัวกลับ"
                    ) {
                      return (
                        <>
                          {inputs.map((value, index) => (
                            <input
                              key={index}
                              id={`input-${index}`}
                              type="text"
                              maxLength={1}
                              value={value}
                              onChange={(e) =>
                                handleChange(e.target.value, index)
                              }
                              className="w-12 h-12 text-center border border-blue-300 rounded font-semibold"
                            />
                          ))}
                        </>
                      );
                    } else if (
                      selectedType === "วิ่งบน" ||
                      selectedType === "วิ่งล่าง"
                    ) {
                      return (
                        <>
                          {inputs.map((value, index) => (
                            <input
                              key={index}
                              id={`input-${index}`}
                              type="text"
                              maxLength={1}
                              value={value}
                              onChange={(e) =>
                                handleChange(e.target.value, index)
                              }
                              className="w-12 h-12 text-center border border-blue-300 rounded font-semibold"
                            />
                          ))}
                        </>
                      );
                    }
                  })()}
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "ลบ", 0, "ล้าง"].map(
                  (key, index) => (
                    <button
                      key={index}
                      onClick={() => handleKeyClick(key)} // เรียกฟังก์ชันเมื่อกดปุ่ม
                      className="bg-blue-500 text-white p-4 rounded hover:bg-gray-400 text-lg font-semibold"
                    >
                      {key}
                    </button>
                  )
                )}
              </div>
              {/* Keypad */}
            </div>
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-lg font-bold text-blue-900 flex items-center">
                  <i className="fas fa-info-circle mr-2"></i> เงื่อนไขในการแทง
                </h2>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {conditions.map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-400 text-wh1ite p-4 rounded-md shadow"
                  >
                    <h3 className="text-lg font-bold">
                      {item.type} จ่าย: {item.pay}
                    </h3>
                    <p className="text-sm mt-2">
                      แทงขั้นต่ำต่อครั้ง: {item.min}
                    </p>
                    <p className="text-sm">แทงสูงสุดต่อครั้ง: {item.max}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NewTiget;
