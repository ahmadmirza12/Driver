import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import { setUnseenBadge } from "../store/reducer/usersSlice";
import { endPoints } from "../services/ENV";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const token = useSelector((state) => state.authConfig.token);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  const initializeSocket = () => {
    if (!token) {
      console.log("No token found for authentication");
      return;
    }
    console.log("Initializing socket with token:", token);

    const socket = io(endPoints.SOCKET_BASE_URL, {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully");
      setSocket(socket);
    });
    socket.on("authenticated", (id) => {
      console.log("Socket authenticated with ID:", id);
      setSocket(socket);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });
    socket.on("unauthorized", (error) => {
      console.error("Unauthorized socket connection:", error.message);
    });

    socket.on("noti-unseen", (res) => {
      dispatch(setUnseenBadge(res));
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected. Attempting to reconnect...");
      setSocket(null);
    });

    socket.on("reconnect", (attemptNumber) => {
      // console.log("Reconnected after", attemptNumber, "attempts");
      socket.emit("authenticate", token);
    });

    socketRef.current = socket;
  };

  useEffect(() => {
    if (token) {
      initializeSocket();
    } else {
      console.log("No token found for authentication");
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        // console.log("Socket disconnected during cleanup");
      }
      setSocket(null);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
