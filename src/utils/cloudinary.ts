// File: utils/cloudinary.ts
import axios from "axios";

export const uploadToCloudinary = async (
  file: File,
  resourceType: "image" | "video",
  setUploadProgress: (progress: {
    thumbnail: number;
    promoVideo: number;
  }) => void
) => {
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  ) {
    throw new Error("Missing Cloudinary environment variables");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("folder", "codenest");

  try {
    // const response = await axios.post(
    //   `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    //   formData,
    //   {
    //     headers: { "Content-Type": "multipart/form-data" },
    //     onUploadProgress: (progressEvent) => {
    //       const percentCompleted = Math.round(
    //         (progressEvent.loaded * 100) / (progressEvent.total || 1)
    //       );
    //       setUploadProgress((prev) => ({
    //         ...prev,
    //         [resourceType === "image" ? "thumbnail" : "promoVideo"]:
    //           percentCompleted,
    //       }));
    //     },
    //   }
    // );
    const resourceType = file.type.startsWith("video") ? "video" : "image";
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data.secure_url;
  } catch (error: any) {
    console.error(
      "Error uploading to Cloudinary:",
      error.response?.data || error
    );
    throw new Error(
      error.response?.data?.error?.message ||
        "Failed to upload file to Cloudinary"
    );
  }
};
