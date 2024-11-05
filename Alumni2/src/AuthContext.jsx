import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds

        if (expiry > Date.now()) {
          setIsLoggedIn(true);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          fetchUserProfile();
        } else {
          // Token is expired
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      handleLogout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsLoggedIn(true);
      await fetchUserProfile();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
