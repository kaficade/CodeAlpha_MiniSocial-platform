import { useState, useRef, type FormEvent } from 'react';
import { Camera } from 'lucide-react';
import type { User } from '@/types';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface ProfileEditFormProps {
  profile: User;
  onClose: () => void;
}

export default function ProfileEditForm({ profile, onClose }: ProfileEditFormProps) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || '');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProfile, uploadAvatar } = useProfile(profile.id);
  const { refreshProfile } = useAuth();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (avatarFile) {
      const error = await uploadAvatar(avatarFile);
      if (error) {
        toast.error('Failed to upload avatar');
        setLoading(false);
        return;
      }
    }

    const error = await updateProfile({ username, bio: bio || null });
    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated!');
      await refreshProfile();
      onClose();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex justify-center">
        <div className="relative">
          <Avatar src={avatarPreview || profile.avatar_url} size="xl" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors cursor-pointer"
          >
            <Camera size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>

      <Input
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">Bio</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text
            placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50
            focus:border-primary transition-all duration-200 resize-none"
          rows={3}
          maxLength={160}
        />
        <p className="text-xs text-text-muted mt-1">{bio.length}/160</p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading} className="flex-1">
          Save Changes
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
