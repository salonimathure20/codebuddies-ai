import axios from "axios";
import { IProfile } from "src/models/profiles";

const API_BASE_URL = "http://localhost:3001/api"; // Replace with your API base URL

export const fetchUserProfile = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${id}`);

    return response.data as IProfile; // Assuming the response contains an array of users
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

// Create a new profile
export const createProfile = async (profileData: {
  userId: string; // Reference to the user
  bio?: string;
  techSkills: string[]; // Array of technical skills
  previousExperience?: string;
  profilePicture?: string; // URL or local path to profile picture
}) => {
  return await axios.post(`${API_BASE_URL}/profile`, profileData);
};

// Get all profiles
export const getProfiles = async () => {
  return await axios.get(`${API_BASE_URL}/profiles`);
};

// Get a profile by userId
export const getProfileByUserId = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/profile/${userId}`);
  return response.data as IProfile;
};

// Update a profile by profileId
export const updateProfile = async (
  profileId: string,
  updates: {
    bio?: string;
    techSkills?: string[];
    previousExperience?: string;
    profilePicture?: string;
  }
) => {
  return await axios.put(`${API_BASE_URL}/profiles/${profileId}`, updates);
};

// Delete a profile picture
export const deleteProfilePicture = async (profileId: string) => {
  return await axios.patch(
    `${API_BASE_URL}/profiles/${profileId}/remove-picture`
  );
};
