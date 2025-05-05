import mongoose from "mongoose";
import { config } from "dotenv";
config();
export const connect = async () => {
  
  await mongoose
  // mongodb://localhost:27017/
    .connect(`mongodb://localhost:27017/social_media`)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
      console.error("❌ Failed to connect to MongoDB:", error);
    });
};

