const { updateSystemStatus } = require("../controllers/Loto");
const cron = require("node-cron");

console.log("Cron job started...");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Running updateSystemStatus...");
    await updateSystemStatus();
    console.log("System status updated successfully");
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
});
