import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi, clearTokens, refreshTokens } from "../api/api";

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
    // [BEST PRACTICE] Silent Refresh on Start
    // Instead of reading tokens from localStorage (unsafe),
    // we ask the backend: "Do I have a valid session cookie?"
    const initializeAuth = async () => {
      // [CLEANUP] Remove old insecure tokens if they exist from previous versions
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      try {
        const data = await refreshTokens();
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Auth initialization failed", err);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
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
