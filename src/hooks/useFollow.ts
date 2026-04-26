import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export function useFollow(targetUserId: string) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFollowData = useCallback(async () => {
    setLoading(true);

    const { count: followers } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', targetUserId);

    const { count: following } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', targetUserId);

    setFollowersCount(followers || 0);
    setFollowingCount(following || 0);

    if (user && user.id !== targetUserId) {
      const { data } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();
      setIsFollowing(!!data);
    }

    setLoading(false);
  }, [targetUserId, user]);

  useEffect(() => {
    fetchFollowData();
  }, [fetchFollowData]);

  const toggleFollow = async () => {
    if (!user || user.id === targetUserId) return;

    if (isFollowing) {
      await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
    } else {
      await supabase.from('followers').insert({
        follower_id: user.id,
        following_id: targetUserId,
      });
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);

      await supabase.from('notifications').insert({
        user_id: targetUserId,
        actor_id: user.id,
        type: 'follow',
      });
    }
  };

  return { isFollowing, followersCount, followingCount, loading, toggleFollow };
}
