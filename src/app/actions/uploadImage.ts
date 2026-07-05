'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageAction(formData: FormData) {
  const file = formData.get('image') as File | null;
  if (!file) return { success: false, error: "No file provided" };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload using base64 to avoid stream/403 issues
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString('base64')}`,
      { resource_type: "image" }
    );
    // console.log(result);
    return { success: true, url: result.secure_url };
  } catch (error: any) {
    console.error("Cloudinary Error:", error);
    return { success: false, error: error.message };
  }
}