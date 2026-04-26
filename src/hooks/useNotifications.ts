import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types';
import { useAuth } from '@/context/AuthContext';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data } = await supabase
      .from('notifications')
      .select('*, actor:users!notifications_actor_id_fkey(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setNotifications(data as unknown as Notification[]);
      setUnreadCount(data.filter(n => !n.read).length);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    await fetchNotifications();
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
    await fetchNotifications();
  };

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, fetchNotifications };
}
