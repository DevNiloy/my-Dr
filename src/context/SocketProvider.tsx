import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useGetMeQuery } from '../redux/api/userApi';
import { useDispatch } from 'react-redux';
import { notificationApi } from '../redux/api/notificationApi';
import { SocketContext } from './SocketContext';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: userData } = useGetMeQuery({});
  const user = userData?.data;
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      // Clean the URL: remove /api if present at the end
      let socketUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5555';
      if (socketUrl.endsWith('/api')) {
        socketUrl = socketUrl.replace('/api', '');
      }
      
      console.log('[SocketProvider] Initializing connection to:', socketUrl);
      
      const newSocket = io(socketUrl, {
        query: {
          userId: user._id,
          role: user.role
        },
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000
      });

      newSocket.on('connect', () => {
        console.log('[SocketProvider] Connection established! ID:', newSocket.id);
      });

      newSocket.on('connect_error', (error) => {
        console.error('[SocketProvider] Connection failed:', error);
      });

      newSocket.on('notification', (data: any) => {
        console.log('[SocketProvider] Real-time notification received:', data);

        // 1. Invalidate so unread count + list refresh from server
        dispatch(notificationApi.util.invalidateTags(['Notifications']));

        // 2. Show toast
        toast.info(
          <div className="flex flex-col gap-1 py-1">
            <span className="font-black text-xs uppercase tracking-widest text-[#ea285a]">{data.title}</span>
            <span className="text-sm font-bold text-slate-800 leading-tight">{data.message}</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1">Just now</span>
          </div>,
          {
            icon: <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">🔔</div>,
            style: {
              borderRadius: '24px',
              border: '2px solid #FFF1F2',
              boxShadow: '0 25px 50px -12px rgb(234 40 90 / 0.15)',
              padding: '16px'
            }
          }
        );
      });

      setSocket(newSocket);

      return () => {
        console.log('[SocketProvider] Disconnecting socket...');
        newSocket.close();
      };
    }
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
