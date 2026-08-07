import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

export const uploadProfilePictureToS3 = async (
  userId: string,
  file: File
): Promise<{ imgUrl: string }> => {
  try {
    // Step 1: Create a FormData object and append the file and metadata
    const formData = new FormData();
    formData.append("file", file); // Attach the file
    formData.append("userId", userId); // Attach userId
    formData.append("filename", file.name);

    // Step 2: Make the API call to get the signed URL and S3 URL
    const response = await axios.post(
      `${API_BASE_URL}/s3/upload-profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      }
    );

    const { signedUrl, imgUrl } = response.data.result;

    // Step 3: Use the pre-signed URL to upload the file to S3
    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    // Return the S3 URL for storing in the profile
    return { imgUrl };
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    throw new Error("Failed to upload profile picture to S3.");
  }
};
