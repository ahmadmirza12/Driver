import {createContext, useContext, useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {io} from 'socket.io-client';

import {setUnseenBadge} from '../store/reducer/usersSlice';
import {endPoints} from '../services/ENV';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({children}) => {
  const token = useSelector(state => state.authConfig.token);

  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const dispatch = useDispatch(null);

  const initializeSocket = () => {
    if (!token) return;

    const newSocket = io(endPoints.SOCKET_BASE_URL, {
      reconnectionAttempts: 15,
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 20000,
    });

    newSocket.emit('authenticate', token);
    newSocket.on('authenticated', id => {
      setSocket(newSocket);
    });
    newSocket.on('connect_error', error => {
      // console.error('Socket connection error:', error);
    });

    newSocket.on('unauthorized', error => {
      // console.error('Unauthorized socket connection:', error.message);
    });
    newSocket.on('noti-unseen', res => {
      dispatch(setUnseenBadge(res));
    });

    newSocket.on('disconnect', () => {
      // console.log('Socket disconnected. Attempting to reconnect...');
      setSocket(null);
      initializeSocket();
    });

    newSocket.on('reconnect', attemptNumber => {
      // console.log('Reconnected after', attemptNumber, 'attempts');
      // Re-authenticate after reconnection
      newSocket.emit('authenticate', token);
    });

    socketRef.current = newSocket;
  };

  useEffect(() => {
    if (token) {
      initializeSocket();
    } else {
      // console.log('No token found for authentication');
    }

    // Clean up on unmount or app kill
    return () => {
      socketRef.current?.disconnect();
      setSocket(null);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export default SocketProvider;
