// components/NotificationsList.tsx
"use client"
import { useState, useEffect } from "react";
import { FaBell, FaCheck, FaTrash, FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";
import { notificationsAPI } from "@/lib/api";

interface Notification {
  id: number;
  title: string;
  message: string;
  audience: string;
  createdAt: string;
  readAt: string | null;
  createdBy: string;
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getUserNotifications(1, 50);
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationsAPI.getUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, readAt: new Date().toISOString() } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading notifications...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaBell />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <FaCheck /> Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaEnvelopeOpen className="mx-auto text-3xl mb-2" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 ${
                !notification.readAt ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {notification.readAt ? (
                      <FaEnvelopeOpen className="text-gray-400" />
                    ) : (
                      <FaEnvelope className="text-blue-500" />
                    )}
                    <h3 className="font-semibold">{notification.title}</h3>
                    {!notification.readAt && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By: {notification.createdBy}</span>
                    <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-2">
                    {notification.audience}
                  </span>
                </div>
                {!notification.readAt && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-4 text-green-600 hover:text-green-800"
                    title="Mark as read"
                  >
                    <FaCheck />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}