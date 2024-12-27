import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const InfoCard = ({ title, round, initialTimeRemaining, closeTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsClosed(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Clear interval when component unmounts
  }, [timeRemaining]);

  // ฟังก์ชันในการแปลงวินาทีให้เป็นรูปแบบเวลา hh:mm:ss
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Link
      to={"tiget"}
      className="bg-white shadow-md rounded-lg p-4 w-[192px] h-[136px]"
    >
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-gray-500">รอบที่ {round}</div>
      {isClosed ? (
        <div className="text-red-500 font-bold">ปิดรอบ</div>
      ) : (
        <div className="text-sm text-blue-500">
          เหลือเวลา: {formatTime(timeRemaining)}
        </div>
      )}
      <div className="text-sm text-gray-500">ปิดรับเวลา {closeTime}</div>
    </Link>
  );
};

export default InfoCard;
