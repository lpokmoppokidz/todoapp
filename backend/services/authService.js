import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// [LEARNING NOTE] Why a Service?
// Services are for "Business Logic". They don't know about Express, Requests, or Responses.
// This makes them reusable and easier to test.

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "14d" }
  );
};

export const registerUser = async (userData) => {
  const { name, email, password } = userData;
  
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    throw new Error("Email already registered");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
  });

  return { id: user._id, name: user.name, email: user.email };
};

export const loginUser = async (credentials, io) => {
  const { email, password } = credentials;
  
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  let valid = await bcrypt.compare(password, user.password);
  
  // Legacy support fallback
  if (!valid && user.password === password) {
    user.password = await bcrypt.hash(password, 10);
    valid = true;
  }

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  // Single session enforcement
  user.refreshTokens = [refreshToken];
  await user.save();

  // Socket notification
  if (io) {
    io.emit("updateOnlineUsers");
    io.emit("userJoined", { name: user.name, id: user._id });
  }

  return {
    user: { id: user._id, name: user.name, email: user.email },
    accessToken,
    refreshToken
  };
};

export const refreshUserToken = async (refreshToken) => {
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.id);
  
  if (!user || !user.refreshTokens.includes(refreshToken)) {
    throw new Error("Refresh token not recognized");
  }

  const accessToken = createAccessToken(user);
  const nextRefreshToken = createRefreshToken(user);
  
  user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
  user.refreshTokens.push(nextRefreshToken);
  await user.save();

  return {
    user: { id: user._id, name: user.name, email: user.email },
    accessToken,
    refreshToken: nextRefreshToken
  };
};

export const logoutUser = async (refreshToken, io) => {
  const payload = jwt.decode(refreshToken);
  if (payload?.id) {
    const user = await User.findById(payload.id);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      await user.save();
    }
  }

  if (io) {
    io.emit("updateOnlineUsers");
  }
};

export const getOnlineUsersData = async (currentUserId) => {
  const users = await User.find(
    { refreshTokens: { $exists: true, $not: { $size: 0 } } },
    "name email _id refreshTokens"
  ).limit(50);

  const onlineUsers = [];

  for (const user of users) {
    if (user._id.toString() === currentUserId) continue;

    let hasValidToken = false;
    for (const token of user.refreshTokens) {
      try {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        hasValidToken = true;
        break;
      } catch (err) {
        continue;
      }
    }

    if (hasValidToken) {
      onlineUsers.push({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        initials: user.name.split(" ").map(n => n[0]).join("").toUpperCase(),
        status: "online",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
      });
    }
  }

  return onlineUsers;
};
