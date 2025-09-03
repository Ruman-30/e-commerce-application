import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";

cloudinary.config({
  cloud_name: config.COULD_NAME,
  api_key: config.API_KEY,
  api_secret: config.API_SECRET,
  secure: true,
});

export function uploadToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder || "ecommerce/products",
        resource_type: "image",
      },
      function (error, result) {
        if (error) {
          return reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(fileBuffer);
  });
}

export function deleteFromCloudinary(publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
}
