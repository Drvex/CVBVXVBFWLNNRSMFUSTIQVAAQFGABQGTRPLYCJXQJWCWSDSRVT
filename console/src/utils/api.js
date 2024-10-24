import axios from "axios";
const API_ADDRESS = process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_ADDRESS,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const UserService = {
  async getUsers(searchTerm = "") {
    try {
      const response = await api.get(
        `/users${searchTerm ? `?search=${searchTerm}` : ""}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async createUser(userData) {
    try {
      const response = await api.post("/users/save", userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async updateUser(id, userData) {
    try {
      const response = await api.post(`/users/update/${id}`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || "API error occurred");
    } else if (error.request) {
      return new Error("No response from server");
    } else {
      return new Error("Error setting up request");
    }
  },
};
