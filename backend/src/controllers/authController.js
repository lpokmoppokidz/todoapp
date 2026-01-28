import * as authService from "../services/authService.js";

// [LEARNING NOTE] Why this change?
// Controllers are like "Waiters" in a restaurant. 
// They take your order (Request), give it to the Chef (Service), 
// and bring you the food (Response). They don't cook the food themselves!

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await authService.registerUser({ name, email, password });

    return res.status(201).json({
      message: "Registration successful. Please login to continue.",
      user,
    });
  } catch (error) {
    const status = error.message === "Email already registered" ? 409 : 500;
    return res.status(status).json({ message: error.message || "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const io = req.app.get("io");
    const data = await authService.loginUser({ email, password }, io);

    // [BEST PRACTICE] Set Refresh Token in HTTP-only Cookie
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true, // Prevents JavaScript from reading the cookie (protects from XSS)
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Protects against CSRF
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    // Return the user and access token in JSON
    return res.json({
      user: data.user,
      accessToken: data.accessToken,
    });
  } catch (error) {
    const status = error.message === "Invalid credentials" ? 401 : 500;
    return res.status(status).json({ message: error.message || "Login failed" });
  }
};

export const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await authService.getOnlineUsersData(req.user.id);
    res.json(onlineUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to get online users" });
  }
};

export const refresh = async (req, res) => {
  try {
    // [BEST PRACTICE] Read Refresh Token from Cookies instead of Body
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const data = await authService.refreshUserToken(refreshToken);

    // Set the NEW refresh token in cookie (Rotation)
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: data.user,
      accessToken: data.accessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message || "Invalid refresh token" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    const io = req.app.get("io");
    if (refreshToken) {
      await authService.logoutUser(refreshToken, io);
    }

    // [BEST PRACTICE] Clear the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
