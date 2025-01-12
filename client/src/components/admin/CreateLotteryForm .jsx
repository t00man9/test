import React, { useState } from "react";
import ReactModal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

ReactModal.setAppElement("#root");

const CreateLotteryForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    openTime: "",
    closeTime: "",
    openDays: [],
    group: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "openDays") {
      const selectedDays = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, openDays: selectedDays });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/lotteries", formData);
      toast.success("Lottery created successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to create lottery");
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Button */}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Create New Lottery
      </button>

      {/* Modal */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center"
      >
        <h3 className="text-xl font-bold mb-4">Create New Lottery</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-3">
              <label className="block font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Lotto Name"
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">Open Days</label>
              <select
                name="openDays"
                multiple
                value={formData.openDays}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                {[...Array(7)].map((_, i) => {
                  const day = new Date(1970, 0, i + 4).toLocaleString("en-US", {
                    weekday: "long",
                  });
                  return (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">Open Time</label>
              <input
                type="time"
                name="openTime"
                value={formData.openTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">Close Time</label>
              <input
                type="time"
                name="closeTime"
                value={formData.closeTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">Group</label>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Group</option>
                <option value="Thai">Thai</option>
                <option value="International">International</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Type</option>
                <option value="Loyal High">Loyal High</option>
                <option value="Quick Win">Quick Win</option>
              </select>
            </div>
          </div>
          <div className="text-right mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Preview Section */}
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h4 className="font-bold mb-2">Preview</h4>
          <p>
            <strong>Name:</strong> {formData.name || "N/A"}
          </p>
          <p>
            <strong>Open Days:</strong>{" "}
            {formData.openDays.length ? formData.openDays.join(", ") : "N/A"}
          </p>
          <p>
            <strong>Open Time:</strong> {formData.openTime || "N/A"}
          </p>
          <p>
            <strong>Close Time:</strong> {formData.closeTime || "N/A"}
          </p>
          <p>
            <strong>Group:</strong> {formData.group || "N/A"}
          </p>
          <p>
            <strong>Type:</strong> {formData.type || "N/A"}
          </p>
        </div>
      </ReactModal>
    </>
  );
};

export default CreateLotteryForm;
