import React, { useEffect, useMemo, useState } from "react";
import {
  createTask,
  fetchTasks,
  fetchUsers,
  updateTaskStatus,
  saveTask,
  unsaveTask,
  fetchFavorites
} from "../api.js";
import { useSocket } from "../context/SocketContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Layout from "./Layout.jsx";
import Board from "./Board.jsx";
import TaskModal from "./TaskModal.jsx";
import FavoritesModal from "./FavoritesModal.jsx";

const emptyTaskForm = {
  title: "",
  assignees: [],
  category: "web_development",
  deadline: ""
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "??";

const groupTasks = (tasks) => ({
  todo: tasks.filter((task) => task.status === "todo"),
  in_progress: tasks.filter((task) => task.status === "in_progress"),
  done: tasks.filter((task) => task.status === "done")
});

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const socket = useSocket();
  const grouped = useMemo(() => groupTasks(tasks), [tasks]);

  const loadTasks = async () => {
    setIsLoadingTasks(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to load users");
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message || "Failed to load favorites");
    }
  };

  useEffect(() => {
    if (user) {
      loadTasks();
      loadUsers();
      loadFavorites();
    }
  }, [user]);

  // [LEARNING NOTE] WebSocket State Synchronization
  // We listen for the 'task:created' event sent by the Backend.
  // This allows us to see new tasks instantly without refreshing!
  useEffect(() => {
    if (!socket) return;

    socket.on("task:created", (newTask) => {
      setTasks((prev) => {
        // Prevent duplicate if this user was the one who created it
        // (The creator already updated their state via the REST response)
        const exists = prev.some(t => t._id === newTask._id);
        if (exists) return prev;
        return [newTask, ...prev];
      });
    });

    return () => {
      socket.off("task:created");
    };
  }, [socket]);

  const handleCreateTask = async () => {
    if (!taskForm.title.trim()) {
      setError("Task title is required");
      return;
    }
    setError("");
    try {
      const created = await createTask({ 
        title: taskForm.title, 
        assignees: taskForm.assignees,
        category: taskForm.category,
        deadline: taskForm.deadline
      });
      setTasks((prev) => [created, ...prev]);
      setTaskForm(emptyTaskForm);
      setShowModal(false);
    } catch (err) {
      setError(err.message || "Could not create task");
    }
  };

  const handleAdvance = async (task) => {
    const nextStatus = task.status === "todo" ? "in_progress" : "done";
    try {
      const updated = await updateTaskStatus(task._id, nextStatus);
      setTasks((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      setError(err.message || "Could not update task");
    }
  };

  const handleDropTask = async (event, nextStatus) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const task = tasks.find((item) => item._id === taskId);
    if (!task || task.status === nextStatus) return;

    const isCreator = task.createdBy?._id === user?.id;
    if (!isCreator) {
      setError("Only the creator can move this task.");
      return;
    }

    try {
      const updated = await updateTaskStatus(taskId, nextStatus);
      setTasks((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      setError(err.message || "Could not update task");
    }
  };

  const handleToggleSave = async (taskId) => {
    const isSaved = favorites.some((fav) => fav._id === taskId);
    
    if (isSaved) {
      setFavorites((prev) => prev.filter((fav) => fav._id !== taskId));
    } else {
      const task = tasks.find((t) => t._id === taskId);
      if (task) {
        setFavorites((prev) => [task, ...prev]);
      }
    }

    try {
      if (isSaved) {
        await unsaveTask(taskId);
      } else {
        await saveTask(taskId);
      }
    } catch (err) {
      if (isSaved) {
        const task = tasks.find((t) => t._id === taskId);
        if (task) {
          setFavorites((prev) => [task, ...prev]);
        }
      } else {
        setFavorites((prev) => prev.filter((fav) => fav._id !== taskId));
      }
      setError(err.message || "Could not update saved status");
    }
  };

  const renderTaskProps = (task) => {
    const isCreator = task.createdBy?._id === user?.id;
    const isExpanded = activeTaskId === task._id;
    const isSaved = favorites.some((fav) => fav._id === task._id);
    return {
      isCreator,
      isExpanded,
      isSaved,
      category: task.category,
      initials: getInitials(task.createdBy?.name),
      onToggle: () => setActiveTaskId(isExpanded ? null : task._id),
      onAdvance: () => handleAdvance(task),
      onToggleSave: () => handleToggleSave(task._id),
      onDragStart: (event) => {
        if (!isCreator) return;
        event.dataTransfer.setData("text/plain", task._id);
      }
    };
  };

  return (
    <Layout
      user={user}
      initials={getInitials(user.name)}
      onLogout={logout}
      savedCount={favorites.length}
      onShowFavorites={() => setShowFavoritesModal(true)}
      onNewIssue={() => setShowModal(true)}
    >
      <Board
        grouped={grouped}
        isLoading={isLoadingTasks}
        onDropTask={handleDropTask}
        renderTaskProps={renderTaskProps}
      />

      {showModal && (
        <TaskModal
          users={users}
          taskForm={taskForm}
          error={error}
          onChange={(field, value) => setTaskForm((prev) => ({ ...prev, [field]: value }))}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
      {showFavoritesModal && (
        <FavoritesModal
          favorites={favorites}
          isOpen={showFavoritesModal}
          onClose={() => setShowFavoritesModal(false)}
          onUnsave={handleToggleSave}
        />
      )}
    </Layout>
  );
};

export default Dashboard;
