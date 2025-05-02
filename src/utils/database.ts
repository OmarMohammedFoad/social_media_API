import mongoose from "mongoose";
import { config } from "dotenv";
config();
export const connect = async () => {
  await mongoose
    .connect(`${process.env.MONGO_URL}`)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
      console.error("❌ Failed to connect to MongoDB:", error);
    });
};