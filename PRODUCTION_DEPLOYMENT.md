# Production Deployment Plan: Workspace App 🚀

This guide provides the exact steps to take your app from `localhost` to the public internet. We will use **MongoDB Atlas** (DB), **Render.com** (Backend), and **Vercel** (Frontend) as they are beginner-friendly and support real-time WebSockets.

---

## 🏗 Phase 1: Database (MongoDB Atlas)
The database must be online first so the backend can connect to it.

1.  **Create Account**: Sign up at [mongodb.com](https://www.mongodb.com/cloud/atlas).
2.  **Create Cluster**: Follow the "Free Tier" wizard. Choose a provider (AWS) and region near you.
3.  **Security (IP Access)**: Add IP address `0.0.0.0/0` (Allow access from anywhere). 
    *   *Why?* Cloud providers like Render change their IP addresses frequently.
4.  **Database User**: Create a user with a username and password.
5.  **Connection String**: Click "Connect" -> "Drivers" -> Copy the URI.
    *   Example: `mongodb+srv://user:pass@cluster.mongodb.net/kanban`

---

## ⚙️ Phase 2: Backend (Render.com)
Render hosting is great for Node.js APIs and automatically provides HTTPS and WebSocket support.

1.  **New Web Service**: Connect your GitHub repository.
2.  **Configuration**:
    *   **Runtime**: `Node`
    *   **Build Command**: `cd backend && npm install`
    *   **Start Command**: `cd backend && npm run start`
3.  **Environment Variables**: Add the following:
    | Key | Value |
    | :--- | :--- |
    | `MONGODB_URI` | *Your Atlas connection string* |
    | `JWT_ACCESS_SECRET` | *Generate a long random string* |
    | `JWT_REFRESH_SECRET`| *Generate another random string* |
    | `CLIENT_ORIGIN` | `https://your-app.vercel.app` (Your future frontend URL) |
    | `PORT` | `10000` (Render's default) |

---

## 🎨 Phase 3: Frontend (Vercel.com)
Vercel is the gold standard for React apps. It will host your static files and serve them over a fast CDN.

1.  **New Project**: Connect your GitHub repository.
2.  **Configuration**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `frontend`
3.  **Environment Variables**: Add this one:
    | Key | Value |
    | :--- | :--- |
    | `VITE_API_URL` | `https://your-api.onrender.com` (Your Render backend URL) |
4.  **Deploy**: Click Deploy! Vercel will build your app and give you a public URL.

---

## ✅ Deployment Verification Checklist

- [ ] **API Health**: Visit `https://your-api.onrender.com/health`. It should show `{"status":"ok"}`.
- [ ] **Login**: Register a new user on the live site. Verify it works.
- [ ] **Realtime**: Open the site in two browser windows. Create a task in one; it should appear in the other within 1 second.
- [ ] **Refresh**: Refresh the page while logged in. You should stay logged in.

---

## 💡 Teaching Corner: Why these steps?

### 1. Why `VITE_API_URL`?
In development, Vite "tricks" the browser into thinking the API is local (proxying). In production, this trick doesn't work. We must tell React exactly where the backend lives on the internet.

### 2. Why the `CLIENT_ORIGIN` secret?
This is **CORS Management**. It tells the server: *"Only allow requests from my Vercel URL. Block everyone else."* This prevents hackers from making requests to your API from their own sites.

### 3. Common Failure: "Mixed Content"
If you try to use `http://` for your API but `https://` for your frontend, the browser will block the request for security. **Always use HTTPS for both.**

---

## 🔗 Your Final URLs (Hypothetical)
- **Frontend**: [https://workspace-kanban.vercel.app](https://workspace-kanban.vercel.app)
- **Backend**: [https://workspace-api.onrender.com](https://workspace-api.onrender.com)
