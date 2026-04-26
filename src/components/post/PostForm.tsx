import { useState, useRef, type FormEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface PostFormProps {
  onSubmit: (content: string, image?: File) => Promise<unknown>;
}

export default function PostForm({ onSubmit }: PostFormProps) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const error = await onSubmit(content, image || undefined);
    if (error) {
      toast.error('Failed to create post');
    } else {
      setContent('');
      removeImage();
      toast.success('Post created!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow-sm border border-border p-4">
      <div className="flex gap-3">
        <Avatar src={profile?.avatar_url} size="md" />
        <div className="flex-1">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full resize-none border-none bg-transparent text-text placeholder:text-text-muted
              focus:outline-none min-h-[80px] text-[15px]"
            rows={3}
          />
          {preview && (
            <div className="relative mt-2 inline-block">
              <img src={preview} alt="Preview" className="max-h-48 rounded-xl object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              <ImagePlus size={20} />
              <span className="text-sm">Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Button type="submit" loading={loading} disabled={!content.trim()} size="sm">
              Post
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
