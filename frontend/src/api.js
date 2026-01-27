import axios from "axios";

// [BEGINNER NOTE]
// This file is the "dictionary" of all requests the Frontend can make to the Backend.
// Instead of writing "fetch(...)" everywhere, we define functions here.

// 1. Where is the Backend?
// We check if there's an environment variable (for production), otherwise use localhost:5009
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5009";

// Helper functions to manage Tokens (your "VIP badge" for the app)
const getTokens = () => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
});

const setTokens = (tokens) => {
  if (tokens?.accessToken)
    localStorage.setItem("accessToken", tokens.accessToken);
  if (tokens?.refreshToken)
    localStorage.setItem("refreshToken", tokens.refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// 2. Create the "Agent" (axios instance)
// This 'api' object will handle all our requests automatically
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Allows sending cookies if needed
});

// [BEGINNER NOTE] "Interceptors": The Middleman
// Before any request leaves the browser, this code runs.
// It automatically attaches your "Access Token" to the request so the Backend knows who you are.
api.interceptors.request.use((config) => {
  const { accessToken } = getTokens();
  if (accessToken) {
    // "Bearer" is a standard authentication type
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Variables to handle "Silent Refresh" (getting a new token without logging out)
let isRefreshing = false;
let refreshQueue = [];

// When many requests fail at once (token expired), this queue helps retry them after refreshing
const processQueue = (error, token = null) => {
  refreshQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  refreshQueue = [];
};

// Response Interceptor: Handling Errors automatically
api.interceptors.response.use(
  (response) => response, // If success, just return data
  async (error) => {
    const original = error.config;

    // If logout failed, don't try to refresh (avoid infinite loops)
    if (original.url?.includes("/api/auth/logout")) {
      return Promise.reject(error);
    }

    // [BEGINNER NOTE] Automatic Token Refresh
    // If Backend says "401 Unauthorized" (Token Expired)...
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for it to finish
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true; // Mark this request as "retried" so we don't loop forever
      isRefreshing = true;

      try {
        // Ask Backend for a new Access Token using our Refresh Token
        const refreshed = await refreshTokens();
        if (!refreshed) {
          // If refresh failed (e.g., Refresh Token also expired), logout user
          clearTokens();
          processQueue(new Error("Session expired"));
          return Promise.reject(error);
        }

        const { accessToken } = getTokens();
        // Retry all queued requests with the new token
        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshError) {
        clearTokens();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Function to refresh tokens explicitly
export const refreshTokens = async () => {
  const { refreshToken } = getTokens();
  if (!refreshToken) return false;

  try {
    const { data } = await axios.post(
      `${API_BASE}/api/auth/refresh`,
      { refreshToken },
      { withCredentials: true },
    );
    setTokens(data);
    return true;
  } catch {
    return false;
  }
};

// Helper: Extract just the 'data' part from the response
const unwrap = (response) => response.data;

// Helper: Format errors nicely
const handleError = (error) => {
  const message = error.response?.data?.message || "Request failed";
  throw new Error(message);
};

// --- API FUNCTIONS (The "Menu" of requests) ---

// LOGIN: Sends email/password -> Gets Tokens
export const login = async (payload) => {
  try {
    const data = await api.post("/api/auth/login", payload).then(unwrap);
    setTokens(data);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const register = async (payload) => {
  try {
    const data = await api.post("/api/auth/register", payload).then(unwrap);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const logout = async () => {
  const { refreshToken } = getTokens();
  try {
    if (refreshToken) {
      await api.post("/api/auth/logout", { refreshToken });
    }
    clearTokens();
    return { success: true };
  } catch (error) {
    return handleError(error);
  }
};

// ONLINE USERS: Asks "Who is online?" -> Gets list of users
export const getOnlineUsers = async () => {
  try {
    const data = await api.get("/api/auth/online-users").then(unwrap);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchTasks = async () => {
  try {
    return await api.get("/api/tasks").then(unwrap);
  } catch (error) {
    return handleError(error);
  }
};

export const createTask = async (payload) => {
  try {
    return await api.post("/api/tasks", payload).then(unwrap);
  } catch (error) {
    return handleError(error);
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    return await api.patch(`/api/tasks/${id}/status`, { status }).then(unwrap);
  } catch (error) {
    return handleError(error);
  }
};

// SAVED TASKS (Favorites)
export const saveTask = async (id) => {
  try {
    return await api.post(`/api/tasks/${id}/save`).then(unwrap);
  } catch (error) {
    return handleError(error);
  }
};

export const unsaveTask = async (id) => {
  try {
    return await api.delete(`/api/tasks/${id}/save`).then(unwrap);
  } catch (error) {
    return handleError(error);
  }
};

export const fetchFavorites = async () => {
  try {
    return await api.get("/api/tasks/favorites").then(unwrap);
  } catch (error) {
    return handleError(error);
  }
};

export const fetchUsers = async () => {
  try {
    return await api.get("/api/users").then(unwrap);
  } catch (error) {
    return handleError(error);
  }
};
