import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "src/models/decoded-token";
import { IUser } from "src/models/user";

const API_BASE_URL = "http://localhost:3001/api";

export const signUp = async (userData: {
  name: string;
  email: string;
  password: string;
  userType?: string;
  isOrganizationUser?: boolean;
  organizationName?: string;
  organizationId?: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/user`, userData);
  const token = response.data.token;
  const decoded: DecodedToken = jwtDecode(token);
  return { token, decoded };
};

export const login = async (userData: { email: string; password: string }) => {
  const response = await axios.post(`${API_BASE_URL}/user/login`, userData);
  const token = response.data.token;
  const decoded: DecodedToken = await jwtDecode(token);
  return { token, decoded };
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};

export const resetPassword = async (
  userId: string,
  userData: {
    newPassword: string;
  }
) => {
  const response = await axios.put(`${API_BASE_URL}/user/${userId}`, userData);
  return response.data;
};

export const fetchActiveUsers = async (organizationId?: string) => {
  try {
    const url = organizationId
      ? `${API_BASE_URL}/user/active-users?organizationId=${organizationId}`
      : `${API_BASE_URL}/user/active-users`;
    const response = await axios.get(url);

    return response.data.data as IUser[]; // Assuming the response contains an array of users
  } catch (error) {
    console.log("Error fetching users", error);
    throw error;
  }
};
