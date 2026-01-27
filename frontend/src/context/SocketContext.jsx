import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Determine the URL based on environment or default to localhost
    // Assuming backend is on port 5002 as seen in server.js
    const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5009";
    
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"], // Try websocket first
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
