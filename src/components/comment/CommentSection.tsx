import { useState, type FormEvent } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Send } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  postId: string;
  onCommentChange?: () => void;
}

export default function CommentSection({ postId, onCommentChange }: CommentSectionProps) {
  const { comments, loading, addComment, deleteComment } = useComments(postId);
  const { user, profile } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await addComment(content);
    setContent('');
    setSubmitting(false);
    onCommentChange?.();
  };

  return (
    <div className="border-t border-border bg-bg/50">
      <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <LoadingSpinner size={20} />
        ) : comments.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-2">No comments yet</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-2.5">
              <Link to={`/profile/${comment.user?.id}`}>
                <Avatar src={comment.user?.avatar_url} size="sm" />
              </Link>
              <div className="flex-1">
                <div className="bg-surface rounded-xl px-3 py-2">
                  <Link to={`/profile/${comment.user?.id}`} className="font-semibold text-xs hover:underline">
                    {comment.user?.username}
                  </Link>
                  <p className="text-sm mt-0.5">{comment.content}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 px-1">
                  <span className="text-xs text-text-muted">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                  {user?.id === comment.user_id && (
                    <button
                      onClick={() => { deleteComment(comment.id); onCommentChange?.(); }}
                      className="text-xs text-text-muted hover:text-danger transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 pt-0 flex items-center gap-2">
        <Avatar src={profile?.avatar_url} size="sm" />
        <div className="flex-1 flex items-center bg-surface rounded-full border border-border pl-4 pr-1">
          <input
            type="text"
            placeholder="Write a comment..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="flex-1 bg-transparent text-sm py-2 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!content.trim() || submitting}
            className="p-2 text-primary hover:bg-surface-hover rounded-full transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
