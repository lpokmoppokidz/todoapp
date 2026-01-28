# 🔐 Secure Auth Refactor: Memory + HTTP-Only Cookies

This document explains the security improvements made to your TodoApp. We moved from storing sensitive tokens in `localStorage` to a more secure architecture used by production-grade applications.

---

## 🏛 architecture Overview

### ❌ Old Insecure Flow
1. **Login**: Backend returns `accessToken` and `refreshToken`.
2. **Storage**: Both tokens are saved in `localStorage`.
3. **Vulnerability**: **XSS (Cross-Site Scripting)**. Any malicious script (from a compromised NPM package or CDN) can read `localStorage` and steal your tokens forever.

### ✅ New Secure Flow
1. **Login**: 
   - `accessToken` is returned in the JSON response (Frontend keeps it in a simple variable).
   - `refreshToken` is set in an **HTTP-only cookie** by the server.
2. **Storage**: 
   - `accessToken`: Memory only (lost on refresh).
   - `refreshToken`: Browser cookie (cannot be read by JavaScript).
3. **Page Refresh (Silent Login)**:
   - Frontend calls `/api/auth/refresh`.
   - Browser automatically sends the `refreshToken` cookie.
   - Backend verifies the cookie and returns a fresh `accessToken`.
4. **API Requests**:
   - `accessToken` is sent in the `Authorization: Bearer <token>` header.
   - If it expires (401 error), Axios automatically calls `/refresh` to get a new one and retries the request.

---

## 🛠 Backend Changes

### 1. Enable Cookie Parsing
In `server.js`, we added `cookie-parser` so Express can read the cookies sent by the browser.

```javascript
import cookieParser from "cookie-parser";
// ...
app.use(cookieParser());
```

### 2. Setting the Cookie (authController.js)
When the user logs in, we don't just send the refresh token back; we "bake" it into a cookie with security flags:

```javascript
res.cookie("refreshToken", data.refreshToken, {
  httpOnly: true, // 🛡️ JavaScript cannot touch this!
  secure: process.env.NODE_ENV === "production", // 🔒 Only HTTPS
  sameSite: "strict", // 🛡️ Prevents CSRF attacks
  maxAge: 14 * 24 * 60 * 60 * 1000, // ⏳ 14 days
});
```

### 3. The `/refresh` Endpoint
This endpoint now checks the **cookie** instead of the request body.

```javascript
const refreshToken = req.cookies.refreshToken;
if (!refreshToken) return res.status(401).json({ message: "No token" });

const data = await authService.refreshUserToken(refreshToken);
// Send new token and update cookie (Rotation)
```

---

## 💻 Frontend Changes

### 1. In-Memory Token (api.js)
We removed all `localStorage.setItem('accessToken', ...)` calls. Instead, we use a local variable in the API file.

```javascript
let _accessToken = null; // Stored in RAM, not on Disk!

export const setAccessToken = (token) => { _accessToken = token; };
```

### 2. Axios Credentials
We added `withCredentials: true` to the Axios instance. This is **CRITICAL**; without it, the browser will block the cookies from being sent to your API.

```javascript
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 🔑 Essential for cookies
});
```

### 3. Silent Refresh (AuthContext.jsx)
When you refresh the page, the `_accessToken` variable is wiped. To fix this, we call `/refresh` as soon as the app starts:

```javascript
useEffect(() => {
  const initializeAuth = async () => {
    const data = await refreshTokens(); // Calls /refresh
    if (data?.user) {
      setUser(data.user);
    }
  };
  initializeAuth();
}, []);
```

---

## 🔄 Token Lifecycle Diagram

1. **User Logs In** -> Server returns `accessToken` (Memory) + `refreshToken` (Cookie).
2. **User Clicks "Add Task"** -> Frontend sends `accessToken` in Header.
3. **15 Mins Later (Token Expires)** -> Server returns `401 Unauthorized`.
4. **Axios Interceptor** -> Automatically calls `/refresh`.
5. **Server Checks Cookie** -> If valid, returns **NEW** `accessToken`.
6. **Axios Retries** -> The original "Add Task" request is sent again with the new token.
7. **User Experience** -> The user never sees a login screen and never knows a refresh happened!

---

## 📡 Socket.IO Authentication

For Realtime features, we have two options:

1. **Current Simple Approach**: 
   Since we use `withCredentials: true` in the socket client, the `refreshToken` cookie is sent during the handshake. You can use a middleware on the backend to verify this cookie.
   
2. **Strict Approach**:
   Pass the `accessToken` in the `auth` object:
   ```javascript
   const socket = io(URL, {
     auth: { token: getAccessToken() }
   });
   ```
   **Note**: If you do this, you must manually reconnect the socket whenever you get a new `accessToken`.

---

## ⚠️ Common Mistakes to Avoid

1. **Forgetting `withCredentials`**: If you forget this on the frontend, your cookies will never reach the server, and `/refresh` will always fail.
2. **Not using HTTPS in production**: `secure: true` cookies require HTTPS. If you test on a non-HTTPS production site, login will fail.
3. **Setting `accessToken` too long**: Access tokens should be short-lived (5-15 mins). Use refresh tokens for the long-term session.

---

## 🏢 Why do real companies use this?

Companies like **Google, Meta, and Netflix** use this approach because it balances security and UX:
- **Security**: Even if a hacker injects a script into your site, they **cannot** steal the session (refresh token) because it's locked in an `httpOnly` cookie.
- **UX**: The user stays logged in for weeks without re-typing their password, thanks to the silent refresh flow.

---
*Generated by Antigravity - Your Security-First Coding Partner.*
