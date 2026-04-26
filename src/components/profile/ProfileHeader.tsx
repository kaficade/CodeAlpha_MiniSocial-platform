import { useState } from 'react';
import { Calendar, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import type { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useFollow } from '@/hooks/useFollow';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import ProfileEditForm from './ProfileEditForm';
import Modal from '@/components/ui/Modal';

interface ProfileHeaderProps {
  profile: User;
  onUpdate?: () => void;
}

export default function ProfileHeader({ profile, onUpdate }: ProfileHeaderProps) {
  const { user } = useAuth();
  const { isFollowing, followersCount, followingCount, toggleFollow } = useFollow(profile.id);
  const [showEditModal, setShowEditModal] = useState(false);
  const isOwner = user?.id === profile.id;

  return (
    <>
      <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-primary-light" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <Avatar src={profile.avatar_url} size="xl" className="ring-4 ring-surface" />
            <div className="flex-1 sm:mb-1">
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              {profile.bio && <p className="text-text-secondary mt-1">{profile.bio}</p>}
            </div>
            <div className="sm:mb-1">
              {isOwner ? (
                <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                  <Edit3 size={16} />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? 'outline' : 'primary'}
                  size="sm"
                  onClick={toggleFollow}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm">
            <div>
              <span className="font-bold">{followersCount}</span>{' '}
              <span className="text-text-muted">Followers</span>
            </div>
            <div>
              <span className="font-bold">{followingCount}</span>{' '}
              <span className="text-text-muted">Following</span>
            </div>
            <div className="flex items-center gap-1 text-text-muted">
              <Calendar size={14} />
              <span>Joined {format(new Date(profile.created_at), 'MMM yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <ProfileEditForm
          profile={profile}
          onClose={() => { setShowEditModal(false); onUpdate?.(); }}
        />
      </Modal>
    </>
  );
}
