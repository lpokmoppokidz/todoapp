# Deployment Guide: Workspace Application

This document provides everything you need to take this application from local development to a production environment.

---

## 🏗 Project Architecture Overview
- **Frontend**: React 18+ powered by **Vite** (Build tool).
- **Backend**: Node.js with **Express** (API) and **Socket.io** (Realtime).
- **Database**: **MongoDB** (Object modeling via Mongoose).
- **Authentication**: Stateless **JWT** (JSON Web Tokens).

---

## 🔑 Environment Variables (.env)
You must set these in your hosting provider's dashboard (e.g., Render, Railway, Vercel).

### Backend Variables (Required & Secret)
| Variable | Description | Example / Default | Secret? |
| :--- | :--- | :--- | :--- |
| `PORT` | The port the server listens on | `5000` | No |
| `MONGODB_URI` | Connection string for your MongoDB | `mongodb+srv://...` | **YES** |
| `JWT_ACCESS_SECRET`| Key used to sign short-term tokens | `random_long_string`| **YES** |
| `JWT_REFRESH_SECRET`| Key used to sign long-term tokens | `random_long_string`| **YES** |
| `CLIENT_ORIGIN` | The URL of your live Frontend | `https://myapp.com` | No |
| `JWT_ACCESS_EXPIRES`| Timeout for access tokens | `15m` | No |
| `JWT_REFRESH_EXPIRES`| Timeout for refresh tokens | `14d` | No |

### Frontend Variables
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | The URL of your live Backend API | `https://api.myapp.com` |

---

## 🚀 Build & Run Commands

### Backend
1. **Install**: `npm install`
2. **Start**: `npm run start` (Runs `node server.js`)
   > [!NOTE]
   > Ensure your environment has Node.js 18 or higher.

### Frontend
1. **Install**: `npm install`
2. **Build**: `npm run build`
   - This creates a `dist/` folder containing static HTML, CSS, and JS.
3. **Deploy**: Upload the contents of `dist/` to a static site host.

---

## 🌐 Network & Security
- **Ports**: Backend is flexible via the `PORT` env var. Frontend is static.
- **CORS**: The backend will reject any request NOT coming from `CLIENT_ORIGIN`. This is a critical security layer.
- **Auth Flow**: 
    1. User logins -> gets `accessToken` and `refreshToken`.
    2. Tokens are stored in **LocalStorage**.
    3. `accessToken` is attached to every request via a "Bearer" header.
- **WebSocket**: Socket.IO connects via the same `VITE_API_URL`. Ensure your host supports WebSockets (sticky sessions are not required as we don't use rooms currently).

---

## ⚠️ Deployment Risks & Checklist
- [] **Health Check**: Verify the `/health` endpoint returns `{ status: "ok" }`.
- [] **Mixed Content**: Ensure both Frontend and Backend use `HTTPS`.
- [] **CORS Mismatch**: If you can't login, check if `CLIENT_ORIGIN` matches your frontend URL exactly (no trailing slash!).
- [] **Database Access**: Ensure your MongoDB Atlas (or other) database has an "IP Access List" that allows connections from your Backend's IP.

---

## 💡 Learning: Dev vs. Production
- **Local**: We use `localhost` for everything. Vite handles proxying `/api` requests to make development easy.
- **Production**: Proxying doesn't exist. The Frontend must know the absolute URL of the Backend (`VITE_API_URL`).
- **Beginner Mistake**: Hard-coding `localhost:5009` in your React code. This will cause "Connection Refused" errors for your users!
