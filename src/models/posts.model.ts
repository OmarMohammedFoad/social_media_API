import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    content: { type: String },
    imageUrl: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    liked: { type: Boolean, default: false },
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Posts", postSchema);
