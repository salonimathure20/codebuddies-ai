import axios from "axios";
import { ISession } from "src/models/session";

const API_BASE_URL = "http://localhost:3001/api";

export const createSessionService = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/session`, data);

    return response.data.data as ISession; // Assuming the response contains an array of users
  } catch (error) {
    console.error("Error creating session", error);
  }
};

export const updateSesionStatus = async (id: string, status: string) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/session/${id}`, {
      status,
    });

    return response.data.data as ISession; // Assuming the response contains an array of users
  } catch (error) {
    console.log("Error updating session", error);
  }
};

export const fetchActiveRequestsForProctor = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/session/proctor/${id}`);

    return response.data.data as ISession[]; // Assuming the response contains an array of users
  } catch (error) {
    console.log("Error fetching users", error);
  }
};

export const fetchSessionsForCoder = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/session/coder/${id}`);

    return response.data.data as ISession[]; // Assuming the response contains an array of users
  } catch (error) {
    console.log("Error fetching users", error);
  }
};

export const fetchSessionById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/session/${id}`);
    return response.data.data as ISession; // Assuming the response contains an array of users
  } catch (error) {
    console.log("Error fetching users", error);
  }
};
