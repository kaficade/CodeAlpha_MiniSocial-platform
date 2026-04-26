import type { Post } from '@/types';
import PostCard from './PostCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PostFeedProps {
  posts: Post[];
  loading: boolean;
  onDelete?: (postId: string) => Promise<unknown>;
  onUpdate?: (postId: string, content: string) => Promise<unknown>;
  onRefresh?: () => void;
  emptyMessage?: string;
}

export default function PostFeed({
  posts,
  loading,
  onDelete,
  onUpdate,
  onRefresh,
  emptyMessage = 'No posts yet',
}: PostFeedProps) {
  if (loading) {
    return <LoadingSpinner className="py-12" size={32} />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
