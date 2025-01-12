import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import useLotteryStore from "../../store/useLotteryStore";
import useTigetStore from "../../store/tiget.store";
import { fetchLotteriesAPI, updateLoto } from "../../api/Loto";
import CreateLotteryForm from "../../components/admin/CreateLotteryForm ";

const Loto = () => {
  const { token } = useTigetStore();
  const [lotteries, setLotteries] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch all lotteries
  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        if (!token) {
          toast.error("JWT token is missing");
          return;
        }
        const response = await fetchLotteriesAPI(token);
        console.log("Data fetched from server:", response.data);
        setLotteries(response.data.lotteries || []);
        console.log(lotteries)
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching lotteries");
      }
    };
    fetchLotteries();
  }, [token]);

  // Handle Save Edited Data
  const handleSaveEdit = async () => {
    try {
      if (!token || !editData) return;
      await updateLoto(token, editData.id, editData);
      setLotteries((prev) =>
        prev.map((lottery) => (lottery.id === editData.id ? editData : lottery))
      );
      setEditModalOpen(false);
      toast.success("Lottery updated successfully!");
    } catch (error) {
      toast.error("Error updating lottery");
    }
  };

  const columns = [
    { field: "name", headerName: "ชื่อหวย", flex: 1 },
    {
      field: "openDays",
      headerName: "วัน",
      flex: 1,
      valueGetter: (params) => {
        const openDays = params.row?.openDays;
        console.log("Row data:", params.row); // ตรวจสอบข้อมูลทั้งแถว
        console.log("OpenDays:", openDays);  // ตรวจสอบ openDays
        return Array.isArray(openDays) && openDays.length > 0
          ? openDays.join(", ")
          : "N/A";
      },
    },
    { field: "openTime", headerName: "เวลา เปิด", flex: 1 },
    { field: "closeTime", headerName: "เวลา ปิด", flex: 1 },
    { field: "group", headerName: "กลุ่ม", flex: 1 },
    { field: "type", headerName: "ประเภท", flex: 1 },
    {
      field: "active",
      headerName: "สถานะ",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color={params.value ? "success" : "error"}
          onClick={() => handleToggleStatus(params.row.id, params.value)}
        >
          {params.value ? "เปิด" : "ปิด"}
        </Button>
      ),
    },
  ];
  
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lottery Management</h1>
      <div className="mb-6 flex justify-start">
        <CreateLotteryForm />
      </div>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={lotteries}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Lottery</h3>
            <form>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Name</label>
                <input
                  type="text"
                  value={editData.name || ""}
                  className="w-full px-4 py-2 border rounded"
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>
              {/* Other fields like openDays, group, etc. */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
              <Button
                variant="text"
                color="error"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loto;
