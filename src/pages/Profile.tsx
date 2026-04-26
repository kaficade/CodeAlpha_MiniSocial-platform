import { useParams } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { usePosts } from '@/hooks/usePosts';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PostFeed from '@/components/post/PostFeed';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { profile, loading: profileLoading, fetchProfile } = useProfile(userId!);
  const { posts, loading: postsLoading, deletePost, updatePost, fetchPosts } = usePosts(userId);

  if (profileLoading) {
    return <LoadingSpinner className="py-20" size={40} />;
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted text-lg">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProfileHeader profile={profile} onUpdate={() => { fetchProfile(); fetchPosts(); }} />
      <h2 className="text-lg font-semibold">Posts</h2>
      <PostFeed
        posts={posts}
        loading={postsLoading}
        onDelete={deletePost}
        onUpdate={updatePost}
        onRefresh={fetchPosts}
        emptyMessage="No posts yet"
      />
    </div>
  );
}
