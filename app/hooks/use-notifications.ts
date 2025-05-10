"use client";

import { useEffect, useState } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "NEW_RESERVATION") {
        const newNotification = {
          id: Date.now(),
          message: `Nova reserva: ${data.data.description}`,
          timestamp: new Date(),
          read: false,
        };

        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Mostrar notificação do navegador se permitido
        if (Notification.permission === "granted") {
          new Notification("Nova Reserva", {
            body: newNotification.message,
          });
        }
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
