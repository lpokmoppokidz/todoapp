# 🏗️ Fullstack TodoApp: Clean Architecture Guide

Welcome to your refactored TodoApp! This guide explains the new structure, why it was chosen, and how the application flows from a "Software Architect" perspective.

---

## 📁 Backend Structure (MVC + Services)

We moved from a flat structure to a clean, modular one inside the `src/` folder.

```text
/backend/src
 ├── config/             # Configuration (DB, CORS)
 ├── controllers/        # Express Request/Response logic
 ├── middlewares/        # Security & Validation (Auth)
 ├── models/             # Database Schemas (Mongoose)
 ├── routes/             # URL path definitions
 ├── services/           # Business Logic (The "Brain")
 ├── sockets/            # Real-time event handling
 ├── app.js              # Express app setup
 └── server.js           # Server bootstrap (Entry point)
```

### 🧠 Why this structure?
1. **Thin Routes**: Routes should only define paths and link them to controllers. They shouldn't contain logic.
2. **Separated Controllers**: Controllers handle the "protocol" (getting data from `req.body` and sending `res.json`). They don't know about the Database.
3. **Robust Services**: Business logic lives here. If you want to change how a user is registered, you change it in the Service, not the Controller. This makes your code reusable.
4. **Bootstrapping Separated**: `app.js` handles the app configuration, while `server.js` handles the actual starting of the server and Socket.IO. This is great for testing!

---

## 🎨 Frontend Structure (Feature-Based)

We organized the frontend to separate UI components from business features and global state.

```text
/frontend/src
 ├── api/                # Axios configuration & API calls
 ├── components/         # Reusable UI (Toast, Buttons)
 ├── context/            # Global state (Auth)
 ├── features/           # Feature-specific logic (Tasks)
 ├── hooks/              # Custom reusable logic (useOnlineUsers)
 ├── layouts/            # Shared layouts (Sidebar, Sidebar)
 ├── pages/              # Route components (DashboardPage)
 ├── socket/             # Socket.IO configuration
 └── App.jsx             # Main router
```

### 🚀 Key Improvements
1. **Pages vs Components**: `pages/` are components tied to a specific URL (like `/login`). `components/` are small, reusable pieces used across many pages.
2. **Features Folder**: Instead of having a giant `components` folder, we group related items (Board, TaskCard, TaskModal) into the `features/tasks` folder.
3. **API Layer**: All communication with the backend is centralized in the `api/` folder.
4. **Socket Layer**: Real-time logic is isolated from the rest of the UI.

---

## 🔁 Application Flow: Step-by-Step

Here is how your app works now:

1. **User opens website**: The browser loads `main.jsx` -> `App.jsx`.
2. **Auth Check**: `AuthContext` runs a `useEffect` that calls `/api/auth/refresh`. It checks if the user has a valid session cookie.
3. **Layout Rendering**: If logged in, `App.jsx` renders the `ProtectedRoute`, which provides the `SocketProvider` and renders `DashboardPage`.
4. **Creating a Task**:
   - User types in `TaskModal`.
   - `DashboardPage` calls `createTask()` in the `api/` layer.
   - Backend `taskRoutes` sends the request to `taskController`.
   - `taskController` uses `taskService` to save to MongoDB.
5. **Real-time Broadcast**: Once saved, the Backend emits a `task:created` event via Socket.IO.
6. **Instant Update**: Other users' browsers receive the event and `DashboardPage` (via a `useEffect` listener) updates the task list immediately without a page refresh!

---

## ⚠️ Common Beginner Mistakes

*   **Logic in the UI**: Don't put heavy math or API calls directly inside a `<div>`. Move them to Services (Backend) or Hooks/API (Frontend).
*   **Direct DB calls in Controllers**: This makes code hard to test. Always use a Service or Model layer.
*   **Relying on LocalStorage for Auth**: We fixed this! Always use Memory + Secure Cookies for production-ready security.

---
*Built with ❤️ by your Senior Engineering Partner.*
