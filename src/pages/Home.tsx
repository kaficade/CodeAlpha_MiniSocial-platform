import { useFeed } from '@/hooks/usePosts';
import { usePosts } from '@/hooks/usePosts';
import PostForm from '@/components/post/PostForm';
import PostFeed from '@/components/post/PostFeed';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const { posts: feedPosts, loading: feedLoading, fetchFeed } = useFeed();
  const { createPost, deletePost, updatePost } = usePosts(user?.id);
  const [activeTab, setActiveTab] = useState<'feed' | 'explore'>('feed');

  const { posts: allPosts, loading: allLoading, fetchPosts: fetchAllPosts, deletePost: deleteAll, updatePost: updateAll } = usePosts();

  const handleRefresh = () => {
    if (activeTab === 'feed') fetchFeed();
    else fetchAllPosts();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PostForm onSubmit={async (content, image) => {
        const error = await createPost(content, image);
        if (!error) handleRefresh();
        return error;
      }} />

      <div className="flex bg-surface rounded-xl border border-border p-1">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-text'
          }`}
        >
          My Feed
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
            activeTab === 'explore'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-text'
          }`}
        >
          Explore
        </button>
      </div>

      {activeTab === 'feed' ? (
        <PostFeed
          posts={feedPosts}
          loading={feedLoading}
          onDelete={deletePost}
          onUpdate={updatePost}
          onRefresh={handleRefresh}
          emptyMessage="Follow users to see their posts here!"
        />
      ) : (
        <PostFeed
          posts={allPosts}
          loading={allLoading}
          onDelete={deleteAll}
          onUpdate={updateAll}
          onRefresh={handleRefresh}
          emptyMessage="No posts yet. Be the first!"
        />
      )}
    </div>
  );
}
