import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<User>) => {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    if (!error) await fetchProfile();
    return error;
  };

  const uploadAvatar = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) return uploadError;

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const profileError = await updateProfile({ avatar_url: urlData.publicUrl });
    return profileError;
  };

  return { profile, loading, updateProfile, uploadAvatar, fetchProfile };
}
