import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "horror_stories",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadMiddleware = multer({ storage });

export default uploadMiddleware;
