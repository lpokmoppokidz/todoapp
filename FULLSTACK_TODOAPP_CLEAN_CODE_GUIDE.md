# 🎓 Fullstack Masterclass: Building a Clean TodoApp

Chào bạn (Hello!), I'm your mentor for today. You've built a working app, which is great! But to go from a "coder" to an "engineer," we need to understand **Clean Architecture**. 

This guide will break down your app into simple pieces, explaining the "Why" behind every folder and the "How" behind every feature.

---

## 🏗️ 1. The Backend: The "Brain" of your App

We follow the **MVC (Model-View-Controller)** pattern, but we added a **Service** layer to make it even cleaner.

### Folder Structure
```text
/backend/src
 ├── config/       # ⚙️ Settings (Database connection, CORS rules)
 ├── models/       # 🗄️ Database Schemas (How a "Task" or "User" looks in MongoDB)
 ├── services/     # 🧠 Business Logic (The actual "math" and "rules" of your app)
 ├── controllers/  # 🤵 The Waiters (Takes your request, talks to Service, returns result)
 ├── routes/       # 📍 The Map (Defines which URL goes to which Controller)
 ├── middlewares/  # 👮 The Security Guards (Checks if you are logged in)
 ├── app.js        # 📦 The Package (Configs Express, security, and routes)
 └── server.js     # 🚀 The Engine (Starts everything: Database, Server, and Sockets)
```

### 🧠 Why did we do this?
*   **Thin Routes**: Routes should be just a list of URLs. They shouldn't "know" how to log a user in.
*   **Controllers shouldn't talk to the DB**: If you want to change your database from MongoDB to PostgreSQL later, you shouldn't have to rewrite your Controllers. Only the **Service** and **Model** should care about the DB.
*   **The Service Layer**: This is where the magic happens. A Controller says "Hey, register this user," and the Service handles the hashing of passwords, checking for duplicates, and saving to the DB.

---

## 🎨 2. The Frontend: The "Face" of your App

We organized the frontend into **Features** and **Layouts** to avoid the "Gigo" (Giant Component) problem.

### Folder Structure
```text
/frontend/src
 ├── api/          # 📞 The Telephone (Centralized Axios calls to Backend)
 ├── features/     # 📦 Feature Units (Tasks, Kanban Board, TaskCards)
 ├── pages/        # 📄 The Main Screen (DashboardPage, AuthPage)
 ├── layouts/      # 🖼️ The Frame (Sidebar, Topbar)
 ├── context/      # 🌍 Global State (Who is logged in?)
 ├── hooks/        # 🛠️ Reusable Tools (useOnlineUsers)
 └── socket/       # 🔌 Real-time Line (How we talk to Socket.IO)
```

### 🧠 Why did we do this?
*   **Components vs Pages**: A `TaskCard` is a **Component** (small, reusable). The `DashboardPage` is a **Page** (it combines components to fill the screen).
*   **API Separation**: Never write `axios.post` directly inside a Button click. Put it in the `api/` folder. This way, if you change your Backend URL, you only change it in **one** place.

---

## 🔐 3. Authentication: How we keep things Secure

We use **JWT (JSON Web Tokens)** with a **Memory + Cookie** strategy. This is what real companies like Google or Airbnb use.

### The Flow:
1.  **Login**: User sends Email/Password.
2.  **Backend Checks**: If correct, the Backend creates two tokens:
    *   **Access Token**: Short-lived (15 mins). Returned in JSON.
    *   **Refresh Token**: Long-lived (14 days). Sent in a `Secure, HttpOnly` **Cookie**.
3.  **Frontend Action**: The `accessToken` is saved in a simple variable (RAM). It's **not** in LocalStorage, so hackers can't steal it!
4.  **Silent Refresh**: When the user refreshes the page, the Frontend asks: *"Hey Backend, I lost my AccessToken, do I have a cookie?"*. The Backend checks the cookie and gives a new AccessToken.

**Analogy**: 
- **Access Token** is like a **Ticket** to a concert. You keep it in your hand.
- **Refresh Token** is like your **Identity Card** in your wallet. If you lose your ticket, you show your ID to get a new one.

---

## 📝 4. Task Features: From Click to Database

Let's look at what happens when you **Create a Task**:

1.  **Frontend (UI)**: You fill out the `TaskModal` and click "Create".
2.  **Frontend (API)**: The component calls `createTask(data)` in `api/api.js`.
3.  **Backend (Route)**: The request hits `POST /api/tasks`.
4.  **Backend (Controller)**: The `taskController` takes the data and says `taskService.createNewTask()`.
5.  **Backend (Service)**: The service generates a Task Code (like `PRO-123`), validates the input, and saves it to MongoDB.
6.  **Socket Update**: The service then tells Socket.IO: *"Hey everyone, a new task was created!"*.
7.  **Frontend (Sync)**: All other users receive the socket event and their UI updates instantly **without reloading**.

---

## ⚡ 5. Real-time: The Socket.IO Magic

Sockets are like a "Walkie-Talkie" that stays on forever.

### Timeline: User A moves a task to "Done"
*   **User A**: Drags a task. Frontend sends API request.
*   **Server**: Receives request, updates Database.
*   **Server**: Emits a message: `io.emit("task:updated", updatedTask)`.
*   **User B**: Their browser is "listening" for `task:updated`. 
*   **User B (UI)**: The task card on User B's screen magically slides to the "Done" column.

---

## ⚠️ Common Beginner Mistakes

1.  **Putting Secret Keys in Git**: Never push your `.env` file to GitHub. (Use `.env.example`).
2.  **Stale State**: Forgetting to use a "Cleanup" function in `useEffect`. Always remove your socket listeners when a component disappears!
3.  **Prop Drilling**: Passing data down through 5 components. **Solution**: Use `Context API` or `Hooks`.

---

## 🧱 Why this structure scales?
If your app grows from 10 tasks to 10,000 tasks, or from 1 user to 1 million users:
*   You can easily add new features without breaking old ones.
*   You can have different teams working on `features/tasks` and `features/auth` at the same time.
*   Your code is readable, testable, and **professional**.

---
*Mentored by Antigravity - Keep coding, keep cleaning!*
