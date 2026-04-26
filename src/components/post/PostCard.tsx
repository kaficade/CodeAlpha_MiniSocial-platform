import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Trash2, Edit3, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useLikes } from '@/hooks/useLikes';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import CommentSection from '@/components/comment/CommentSection';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => Promise<unknown>;
  onUpdate?: (postId: string, content: string) => Promise<unknown>;
  onRefresh?: () => void;
}

export default function PostCard({ post, onDelete, onUpdate, onRefresh }: PostCardProps) {
  const { user } = useAuth();
  const { toggleLike } = useLikes();
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const isOwner = user?.id === post.user_id;

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);
    await toggleLike(post.id, wasLiked);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    const error = await onDelete(post.id);
    if (error) {
      toast.error('Failed to delete post');
    } else {
      toast.success('Post deleted');
    }
    setShowMenu(false);
  };

  const handleUpdate = async () => {
    if (!onUpdate || !editContent.trim()) return;
    const error = await onUpdate(post.id, editContent);
    if (error) {
      toast.error('Failed to update post');
    } else {
      toast.success('Post updated');
      setIsEditing(false);
    }
  };

  return (
    <article className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <Link to={`/profile/${post.user?.id}`} className="flex items-center gap-3">
            <Avatar src={post.user?.avatar_url} size="md" />
            <div>
              <p className="font-semibold text-sm hover:underline">{post.user?.username}</p>
              <p className="text-xs text-text-muted">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </Link>
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
              >
                <MoreHorizontal size={18} className="text-text-muted" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-surface rounded-xl shadow-lg border border-border py-1 w-36 z-10">
                  <button
                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover text-danger flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-3">
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-bg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleUpdate}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => { setIsEditing(false); setEditContent(post.content); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
        )}

        {post.image_url && (
          <div className="mt-3 -mx-4">
            <img src={post.image_url} alt="Post" className="w-full max-h-[500px] object-cover" />
          </div>
        )}

        <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
              liked ? 'text-secondary' : 'text-text-muted hover:text-secondary'
            }`}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            <span>{likesCount}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <MessageCircle size={18} />
            <span>{post.comments_count || 0}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <CommentSection postId={post.id} onCommentChange={onRefresh} />
      )}
    </article>
  );
}
