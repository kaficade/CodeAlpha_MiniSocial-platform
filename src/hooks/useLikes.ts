import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export function useLikes() {
  const { user } = useAuth();

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;

    if (isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);
    } else {
      await supabase.from('likes').insert({
        user_id: user.id,
        post_id: postId,
      });

      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (post && post.user_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: post.user_id,
          actor_id: user.id,
          type: 'like',
          post_id: postId,
        });
      }
    }
  };

  return { toggleLike };
}
