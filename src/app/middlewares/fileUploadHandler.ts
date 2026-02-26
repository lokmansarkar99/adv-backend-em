import { Request } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import ApiError from "../../errors/ApiErrors";

const fileUploadHandler = () => {
  // Base upload folder
  const baseUploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
  }

  // Helper to create folder if not exists
  const createDir = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  };

  // ================= STORAGE =================
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir = "";

      // All image field names
      const imageFields = ["image", "profileImage", "productImage"];

      if (imageFields.includes(file.fieldname)) {
        uploadDir = path.join(baseUploadDir, "image");
      } else if (file.fieldname === "media") {
        uploadDir = path.join(baseUploadDir, "media");
      } else if (file.fieldname === "doc") {
        uploadDir = path.join(baseUploadDir, "doc");
      } else {
        return cb(
          new ApiError(StatusCodes.BAD_REQUEST, "File field is not supported"),
          ""
        );
      }

      createDir(uploadDir);
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(".")
          .join("-") +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  // ================= FILE FILTER =================
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const mime = file.mimetype;

    // Image validation
    if (mime.startsWith("image/")) {
      if (["image/jpeg", "image/png", "image/jpg"].includes(mime)) {
        return cb(null, true);
      }
      return cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Only .jpeg, .jpg, or .png files are supported"
        )
      );
    }

    // Video & Audio validation
    if (mime === "video/mp4" || mime === "audio/mpeg") {
      return cb(null, true);
    }

    // PDF validation
    if (mime === "application/pdf") {
      return cb(null, true);
    }

    return cb(
      new ApiError(StatusCodes.BAD_REQUEST, "This file type is not supported")
    );
  };

  // ================= MULTER CONFIG =================
  const upload = multer({
    storage,
    fileFilter,
  }).fields([
    { name: "profileImage", maxCount: 1 },
    { name: "productImage", maxCount: 5 },
    { name: "image", maxCount: 3 },
    { name: "media", maxCount: 3 },
    { name: "doc", maxCount: 3 },
  ]);

  return upload;
};

export default fileUploadHandler;