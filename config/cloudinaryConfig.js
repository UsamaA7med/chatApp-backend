import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryUploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    resource_type: "auto",
  });
};

const cloudinaryDeleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export { cloudinaryUploadImage, cloudinaryDeleteImage };
