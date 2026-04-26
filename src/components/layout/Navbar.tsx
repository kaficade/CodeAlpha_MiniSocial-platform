import { Link, useNavigate } from 'react-router-dom';
import { Home, Bell, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import Avatar from '@/components/ui/Avatar';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as UserType } from '@/types';

export default function Navbar() {
  const { profile, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/login');
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const { data } = await supabase
      .from('users')
      .select('*')
      .ilike('username', `%${query}%`)
      .limit(5);
    setSearchResults(data || []);
  };

  return (
    <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Mini Social
        </Link>

        <div className="hidden sm:block relative">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              className="pl-10 pr-4 py-2 rounded-full bg-bg border border-border text-sm w-64
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-surface rounded-xl shadow-lg border border-border overflow-hidden">
              {searchResults.map(u => (
                <Link
                  key={u.id}
                  to={`/profile/${u.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                >
                  <Avatar src={u.avatar_url} size="sm" />
                  <div>
                    <p className="font-medium text-sm">{u.username}</p>
                    {u.bio && <p className="text-xs text-text-muted truncate">{u.bio}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Link to="/" className="p-2 hover:bg-surface-hover rounded-lg transition-colors" title="Home">
            <Home size={20} />
          </Link>
          <Link to="/search" className="p-2 hover:bg-surface-hover rounded-lg transition-colors sm:hidden" title="Search">
            <Search size={20} />
          </Link>
          <Link to="/notifications" className="p-2 hover:bg-surface-hover rounded-lg transition-colors relative" title="Notifications">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          {profile && (
            <Link to={`/profile/${profile.id}`} className="p-2 hover:bg-surface-hover rounded-lg transition-colors" title="Profile">
              <User size={20} />
            </Link>
          )}
          <button onClick={handleSignOut} className="p-2 hover:bg-surface-hover rounded-lg transition-colors text-danger cursor-pointer" title="Sign Out">
            <LogOut size={20} />
          </button>
          {profile && (
            <Link to={`/profile/${profile.id}`} className="ml-2 hidden sm:block">
              <Avatar src={profile.avatar_url} alt={profile.username} size="sm" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
