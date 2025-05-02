import multer from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";
const uploadPath = "uploads/posts";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}


const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const allowedTypes = /jpeg|jpg|png|gif/;

  const isValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (!isValid) {
    cb(
      new Error("Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.")
    );
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
});

export default upload;
