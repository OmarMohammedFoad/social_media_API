import mongoose from "mongoose";
import { config } from "dotenv";
config();
export const connect = async () => {
  console.log("data connected");
  
  await mongoose

     .connect(`${process.env.MONGO_PUBLIC_URL}/test`)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
      console.error("❌ Failed to connect to MongoDB:", error);
    });
};
