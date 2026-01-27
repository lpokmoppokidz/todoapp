import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi, clearTokens } from "../api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("user");
        clearTokens();
      }
    }
    setLoading(false);
  }, []);

  const login = async (payload) => {
    const data = await loginApi(payload);
    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("lastRoute");
      clearTokens();
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
