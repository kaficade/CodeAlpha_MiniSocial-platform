import { useNotifications } from '@/hooks/useNotifications';
import NotificationList from '@/components/notification/NotificationList';

export default function Notifications() {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <NotificationList
        notifications={notifications}
        loading={loading}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </div>
  );
}
