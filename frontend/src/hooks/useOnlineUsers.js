import { useState, useEffect } from "react";
import { useSocket } from "../socket/SocketContext.jsx";
import { getOnlineUsers } from "../api/api";

// [LEARNING NOTE] Custom Hooks
// Hooks allow us to "reuse logic" across components.
// Here, we take all the complex "Sidebar" logic related to online users
// and put it in one place. Now any component can easily see who's online!

export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useSocket();

  const fetchOnlineUsers = async () => {
    try {
      const users = await getOnlineUsers();
      setOnlineUsers(users);
    } catch (error) {
      console.error('Failed to fetch online users:', error);
    }
  };

  useEffect(() => {
    fetchOnlineUsers();
    
    if (socket) {
      socket.on("updateOnlineUsers", fetchOnlineUsers);
    }
    
    const interval = setInterval(fetchOnlineUsers, 30000); // 30s heartbeat
    
    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off("updateOnlineUsers", fetchOnlineUsers);
      }
    };
  }, [socket]);

  return onlineUsers;
};
