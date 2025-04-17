import { useEffect, useState } from "react";
import SummaryAPI from "../common";
import { Link } from "react-router-dom";

const HeaderNotifications = ({ onClose, onRead, socket }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch(SummaryAPI.getNotifications.url, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (err) {
        console.error("Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Real-time listener
    if (socket) {
      socket.on("receive_notification", (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
      });

      return () => {
        socket.off("receive_notification");
      };
    }
  }, [socket]);

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(SummaryAPI.markAllNotificationsRead.url, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
        onRead();
      }
    } catch (err) {
      console.error("Error marking all as read", err);
    }
  };

  return (
    <div className="absolute right-[-100px] top-12 sm:top-10 w-[90vw] sm:w-80 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border dark:border-gray-700 rounded-md shadow-xl z-50 max-h-[400px] overflow-y-auto scroll-smooth transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
        <span className="font-semibold text-sm">Notifications</span>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="p-4 text-sm text-gray-400 italic text-center">
          🎉 You’re all caught up!
        </div>
      ) : (
        notifications.map((notification) => (
          <Link
            key={notification._id}
            to={notification.link || "#"}
            onClick={async () => {
              try {
                await fetch(`${SummaryAPI.markNotificationRead(notification._id)}`, {
                  method: "PATCH",
                  credentials: "include",
                });
                onRead();
                onClose();
              } catch (err) {
                console.error("Failed to mark notification as read", err);
              }
            }}
            className={`block px-4 py-3 text-sm border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer ${
              !notification.isRead ? "bg-blue-50 dark:bg-blue-900" : ""
            }`}
          >
            <p>{notification.message}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </Link>
        ))
      )}
    </div>
  );
};

export default HeaderNotifications;
