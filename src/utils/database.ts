import mongoose from "mongoose";

export const connect = async () => {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/social-media")
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
      console.error("❌ Failed to connect to MongoDB:", error);
    });
};
