import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import apiRoutes from "./routes/api.routes";
import { fetchAndStoreEthPrice } from "./controllers/ethprice.controllers";
import connectDatabase from "./config/database.config";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);

cron.schedule("*/10 * * * *", fetchAndStoreEthPrice);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await connectDatabase.connectDatabase();
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
