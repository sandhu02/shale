import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";


// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


const uploadToCloudinary = async (
  file: File,
  folder = "items"
): Promise<string> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result!.secure_url);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

export default uploadToCloudinary;