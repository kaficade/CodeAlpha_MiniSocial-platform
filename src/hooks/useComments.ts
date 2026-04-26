import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Comment } from '@/types';
import { useAuth } from '@/context/AuthContext';

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('comments')
      .select('*, user:users(*)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (data) setComments(data);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (content: string) => {
    if (!user) return;

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content,
    });

    if (!error) {
      await fetchComments();
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();
      if (post && post.user_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: post.user_id,
          actor_id: user.id,
          type: 'comment',
          post_id: postId,
        });
      }
    }
    return error;
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (!error) await fetchComments();
    return error;
  };

  return { comments, loading, addComment, deleteComment, fetchComments };
}
