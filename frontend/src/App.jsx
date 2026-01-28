import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { SocketProvider } from "./socket/SocketContext.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

// [CLEAN CODE] NavigationHandler handles route persistence logic
const NavigationHandler = () => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasRestored, setHasRestored] = useState(false);

  useEffect(() => {
    if (user && !hasRestored) {
      const lastRoute = localStorage.getItem("lastRoute");
      if (lastRoute && lastRoute !== "/login" && lastRoute !== location.pathname) {
        navigate(lastRoute, { replace: true });
      }
      setHasRestored(true);
    }
    
    if (user && location.pathname !== "/login") {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location, user, hasRestored, navigate]);

  return null;
};

// [CLEAN CODE] ProtectedRoute wrapper ensures only logged-in users enter
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
  
  // Provide socket context only when authenticated
  return (
    <SocketProvider>
       {children}
    </SocketProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigationHandler />
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
