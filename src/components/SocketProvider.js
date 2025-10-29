// Driver-side: components/SocketProvider.js (React Native)
import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setUnseenBadge } from "../store/reducer/usersSlice";
import { endPoints } from "../services/ENV";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

const SocketProvider = ({ children }) => {
  const token = useSelector((state) => state.authConfig.token);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const initializeSocket = useCallback(() => {
    if (!token) {
      console.log("❌ No token available for socket connection");
      return null;
    }

    // Disconnect existing socket
    if (socketRef.current) {
      console.log("🔄 Cleaning up existing socket");
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log("🚀 Initializing socket connection...");

    const newSocket = io(endPoints.SOCKET_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    // Store reference immediately
    socketRef.current = newSocket;

    // Connection successful
    newSocket.on("connect", () => {
      console.log("✅ Socket connected successfully. ID:", newSocket.id);
      setIsConnected(true);
      setSocket(newSocket);
      reconnectAttempts.current = 0;
    });

    // Authentication confirmed
    newSocket.on("authenticated", (data) => {
      console.log("🔐 Socket authenticated:", data);
    });

    // Connection error
    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setIsConnected(false);
    });

    // General error
    newSocket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    // Unauthorized
    newSocket.on("unauthorized", (error) => {
      console.error("🚫 Unauthorized socket connection:", error?.message || error);
      setIsConnected(false);
    });

    // Handle unseen notifications
    newSocket.on("noti-unseen", (res) => {
      console.log("🔔 Unseen notification:", res);
      dispatch(setUnseenBadge(res));
    });

    // Disconnected
    newSocket.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected. Reason:", reason);
      setIsConnected(false);
      setSocket(null);
    });

    // Reconnection events
    newSocket.io.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    newSocket.io.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}/${maxReconnectAttempts}`);
    });

    newSocket.io.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error.message);
    });

    newSocket.io.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed after", maxReconnectAttempts, "attempts");
    });

    return newSocket;
  }, [token, dispatch]);

  // Initialize socket when token is available
  useEffect(() => {
    if (token) {
      const newSocket = initializeSocket();

      return () => {
        if (socketRef.current) {
          console.log("🧹 Cleaning up socket on unmount");
          socketRef.current.removeAllListeners();
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // No token, clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
    }
  }, [token, initializeSocket]);

  const contextValue = {
    socket,
    isConnected,
    reconnect: initializeSocket,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;