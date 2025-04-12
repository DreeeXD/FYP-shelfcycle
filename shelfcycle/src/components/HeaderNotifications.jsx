import { useEffect, useState } from "react";
import SummaryAPI from "../common";
import { Link } from "react-router-dom";

const HeaderNotifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-xl z-50 max-h-[400px] overflow-y-auto">
      <div className="p-4 border-b font-semibold text-gray-800">Notifications</div>

      {loading ? (
        <div className="p-4 text-sm text-gray-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="p-4 text-sm text-gray-500">No notifications yet.</div>
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
                onRead(); // reset the bell count
                onClose(); // close dropdown
              } catch (err) {
                console.error("Failed to mark notification as read", err);
              }
            }}
            className={`block px-4 py-3 text-sm border-b hover:bg-gray-100 ${
              !notification.isRead ? "bg-blue-50" : ""
            }`}
          >
            {notification.message}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default HeaderNotifications;
