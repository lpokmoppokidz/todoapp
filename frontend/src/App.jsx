import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import AuthView from "./components/AuthView.jsx";
import Dashboard from "./components/Dashboard.jsx";

// Component to handle route tracking
const NavigationHandler = () => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasRestored, setHasRestored] = useState(false);

  useEffect(() => {
    // 1. Handle route restoration on first load
    if (user && !hasRestored) {
      const lastRoute = localStorage.getItem("lastRoute");
      if (lastRoute && lastRoute !== "/login" && lastRoute !== location.pathname) {
        navigate(lastRoute, { replace: true });
      }
      setHasRestored(true);
    }
    
    // 2. Track current route (except login)
    if (user && location.pathname !== "/login") {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location, user, hasRestored, navigate]);

  return null;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <SocketProvider>
       {children}
    </SocketProvider>
  );
};

// Login Page Wrapper to handle auth logic
const LoginPage = () => {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    mode: "login",
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleAuthSubmit = async () => {
    setError("");
    try {
      const payload = {
        email: authState.email,
        password: authState.password,
        ...(authState.mode === "register" ? { name: authState.name } : {})
      };
      
      if (authState.mode === "register") {
        const { register } = await import("./api.js");
        const data = await register(payload);
        setError(data.message || "Registration successful. Please login.");
        setAuthState(prev => ({ ...prev, mode: "login", password: "" }));
      } else {
        await login(payload);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <AuthView
      authState={authState}
      error={error}
      onChange={(field, value) => setAuthState((prev) => ({ ...prev, [field]: value }))}
      onSubmit={handleAuthSubmit}
      onToggle={() =>
        setAuthState((prev) => ({
          ...prev,
          mode: prev.mode === "login" ? "register" : "login"
        }))
      }
    />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigationHandler />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Default redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
