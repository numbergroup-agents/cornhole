"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  createElement,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const serverUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

    const newSocket = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("[Socket] Connected:", newSocket.id);
      setConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.warn("[Socket] Connection error:", error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return createElement(
    SocketContext.Provider,
    { value: { socket, connected } },
    children
  );
}

/**
 * Hook to access the shared Socket.io connection.
 * Returns the socket instance and connection status.
 */
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}

/**
 * Hook to listen for a specific socket event.
 */
export function useSocketEvent<T = unknown>(
  event: string,
  handler: (data: T) => void
) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}
