import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/types';
import Avatar from '@/components/ui/Avatar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const iconMap = {
  like: <Heart size={16} className="text-secondary" fill="currentColor" />,
  comment: <MessageCircle size={16} className="text-primary" />,
  follow: <UserPlus size={16} className="text-success" />,
};

const messageMap = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
};

export default function NotificationList({ notifications, loading, onMarkAsRead, onMarkAllAsRead }: NotificationListProps) {
  if (loading) return <LoadingSpinner className="py-12" size={32} />;

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted text-lg">No notifications yet</p>
      </div>
    );
  }

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div>
      {hasUnread && (
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
            Mark all as read
          </Button>
        </div>
      )}
      <div className="space-y-2">
        {notifications.map(notification => (
          <Link
            key={notification.id}
            to={notification.type === 'follow'
              ? `/profile/${notification.actor_id}`
              : notification.post_id ? `/profile/${notification.actor_id}` : '#'
            }
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
            className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
              notification.read ? 'bg-surface' : 'bg-primary/5 border border-primary/20'
            } hover:bg-surface-hover`}
          >
            <div className="relative">
              <Avatar src={notification.actor?.avatar_url} size="md" />
              <span className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
                {iconMap[notification.type]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold">{notification.actor?.username}</span>{' '}
                <span className="text-text-secondary">{messageMap[notification.type]}</span>
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
            {!notification.read && (
              <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
