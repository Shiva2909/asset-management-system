import { apiUrl } from "./api";

export const authService = {
  async login(username, password) {
    try {
      const response = await apiUrl.post("/auth/login", {
        username: username.trim(),
        password,
      });

      console.log("LOGIN SUCCESS:", response.data);

      return this.saveSession(response.data);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("RESPONSE:", error.response?.data);

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      // Backend invalid credentials ke liye 401 ya 404 dono de sakta hai
      if (status === 401 || status === 404) {
        throw new Error(serverMessage || "Invalid username or password");
      }

      if (!error.response) {
        throw new Error(
          "Unable to connect to server. Please check the backend.",
        );
      }

      if (status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(serverMessage || "Login failed. Please try again.");
    }
  },

  saveSession(data) {
    if (!data?.token) {
      throw new Error("Token not received from server.");
    }

    if (!data?.user) {
      throw new Error("User information not received from server.");
    }

    const user = {
      id: data.user.userId,
      name: data.user.username,
      email: data.user.email || data.user.username,
      role: data.user.role,
    };

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(user));

    return {
      token: data.token,
      user,
    };
  },

  getToken() {
    return localStorage.getItem("auth_token");
  },

  getCurrentUser() {
    const user = localStorage.getItem("auth_user");

    if (!user || user === "undefined" || user === "null") {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem("auth_user");
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
};
