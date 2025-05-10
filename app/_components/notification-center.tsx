"use client";

import { useNotifications } from "@/app/hooks/use-notifications";
import { BellDotIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  return (
    <div className="relative w-full">
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) markAllAsRead();
        }}
        variant="default"
        className="flex w-full gap-2"
      >
        <BellDotIcon /> Ver todas as Notificações
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="center-0 absolute z-50 mt-2 w-80 rounded-md border bg-background shadow-2xl">
          <div className="flex items-center justify-between p-3">
            <h3 className="font-semibold">Notificações</h3>
            <button
              onClick={requestNotificationPermission}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Ativar notificações
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-foreground">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer border-b border-gray-100 p-3 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
