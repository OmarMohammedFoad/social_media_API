import mongoose from "mongoose";
import { config } from "dotenv";
config();
export const connect = async () => {
  await mongoose
    // mongodb://localhost:27017/
    .connect(`${process.env.MONGO_URL}`)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
      console.error("❌ Failed to connect to MongoDB:", error);
    });
};
