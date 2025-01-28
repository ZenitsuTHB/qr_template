
import { useState, useEffect } from 'react';
import NotificationPopover from './NotificationPopover';
import './css/animations.css'

const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const triggerNotification = (message, type) => {
    setNotifications((prevNotifications) => {
      const isDuplicate = prevNotifications.some(
        (n) => n.message === message && n.type === type
      );

      if (isDuplicate) {
        const updatedNotifications = prevNotifications.map((n) =>
          n.message === message && n.type === type
            ? { ...n, count: (n.count || 1) + 1 }
            : n
        );
        return updatedNotifications;
      }

      const id = new Date().getTime();
      return [...prevNotifications, { id, message, type }];
    });
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const NotificationComponent = () => (
    <div className="notification-component">
      {notifications.map((notification) => (
        <NotificationPopover
          key={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </div>
  );

  return { triggerNotification, NotificationComponent };
};

export default useNotification;