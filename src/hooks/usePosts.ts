import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';

export function usePosts(userId?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select(`
        *,
        user:users(*),
        likes_count:likes(count),
        comments_count:comments(count)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data } = await query;

    if (data) {
      let likedPostIds: Set<string> = new Set();
      if (user) {
        const { data: likes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id);
        likedPostIds = new Set(likes?.map(l => l.post_id) || []);
      }

      const formatted: Post[] = data.map((p) => ({
        ...p,
        likes_count: (p.likes_count as unknown as { count: number }[])?.[0]?.count || 0,
        comments_count: (p.comments_count as unknown as { count: number }[])?.[0]?.count || 0,
        is_liked: likedPostIds.has(p.id),
      }));
      setPosts(formatted);
    }
    setLoading(false);
  }, [userId, user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (content: string, imageFile?: File) => {
    if (!user) return;

    let image_url: string | null = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, imageFile);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      content,
      image_url,
    });

    if (!error) await fetchPosts();
    return error;
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) await fetchPosts();
    return error;
  };

  const updatePost = async (postId: string, content: string) => {
    const { error } = await supabase
      .from('posts')
      .update({ content })
      .eq('id', postId);
    if (!error) await fetchPosts();
    return error;
  };

  return { posts, loading, createPost, deletePost, updatePost, fetchPosts };
}

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFeed = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data: following } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', user.id);

    const followingIds = following?.map(f => f.following_id) || [];
    followingIds.push(user.id);

    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(*),
        likes_count:likes(count),
        comments_count:comments(count)
      `)
      .in('user_id', followingIds)
      .order('created_at', { ascending: false });

    if (data) {
      const { data: likes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id);
      const likedPostIds = new Set(likes?.map(l => l.post_id) || []);

      const formatted: Post[] = data.map((p) => ({
        ...p,
        likes_count: (p.likes_count as unknown as { count: number }[])?.[0]?.count || 0,
        comments_count: (p.comments_count as unknown as { count: number }[])?.[0]?.count || 0,
        is_liked: likedPostIds.has(p.id),
      }));
      setPosts(formatted);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return { posts, loading, fetchFeed };
}
