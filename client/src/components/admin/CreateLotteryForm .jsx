import React, { useState } from "react";
import useTigetStore from "../../store/tiget.store";
import { createLotteryAPI } from "../../api/Loto";

const CreateLotteryForm = () => {
  const token = useTigetStore((state) => state.token);

  const [formData, setFormData] = useState({
    name: "",
    openDate: "",
    closeDate: "",
    openDays: [],
    autoOpenNext: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "openDays") {
      setFormData((prev) => ({
        ...prev,
        openDays: checked
          ? [...prev.openDays, value]
          : prev.openDays.filter((day) => day !== value),
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createLotteryAPI(token, formData);
      console.log("Lottery created:", response.data);
    } catch (error) {
      console.error("Error creating lottery:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create New Lottery</h2>

      {/* แสดง error message หากมี */}
      {/* {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} */}

      <form onSubmit={handleSubmit}>
        <label>ชื่อหวย</label>
        <input name="name" value={formData.name} onChange={handleChange} />

        <label>วันเปิด</label>
        <input
          type="datetime-local"
          name="openDate"
          value={formData.openDate}
          onChange={handleChange}
        />

        <label>วันปิด</label>
        <input
          type="datetime-local"
          name="closeDate"
          value={formData.closeDate}
          onChange={handleChange}
        />

        <label>วันเปิดรับ</label>
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day) => (
          <div key={day}>
            <label>
              <input
                type="checkbox"
                name="openDays"
                value={day}
                checked={formData.openDays.includes(day)}
                onChange={handleChange}
              />
              {day}
            </label>
          </div>
        ))}

        <label>
          <input
            type="checkbox"
            name="autoOpenNext"
            checked={formData.autoOpenNext}
            onChange={handleChange}
          />
          เปิดอัตโนมัติรอบถัดไป
        </label>

        <button type="submit">บันทึก</button>
      </form>
    </div>
  );
};

export default CreateLotteryForm;
