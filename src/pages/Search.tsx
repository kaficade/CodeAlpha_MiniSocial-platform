import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import Avatar from '@/components/ui/Avatar';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from('users')
      .select('*')
      .ilike('username', `%${value}%`)
      .limit(20);
    setResults(data || []);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search Users</h1>
      <div className="relative mb-6">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          autoFocus
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border text-base
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">Searching...</div>
      ) : results.length > 0 ? (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          {results.map(user => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-colors border-b border-border last:border-b-0"
            >
              <Avatar src={user.avatar_url} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{user.username}</p>
                {user.bio && <p className="text-xs text-text-muted truncate">{user.bio}</p>}
              </div>
            </Link>
          ))}
        </div>
      ) : searched && query.length >= 2 ? (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg">No users found for &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-muted text-lg">Type at least 2 characters to search</p>
        </div>
      )}
    </div>
  );
}
