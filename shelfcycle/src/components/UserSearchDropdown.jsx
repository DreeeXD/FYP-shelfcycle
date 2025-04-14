import { useEffect, useRef, useState } from 'react';
import SummaryAPI from '../common';

const UserSearchDropdown = ({ onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        const res = await fetch(`${SummaryAPI.searchUsers.url}?q=${query}`, {
          credentials: 'include',
        });
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          setSuggestions(result.data);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (err) {
        console.error('User search failed:', err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (user) => {
    onUserSelect(user);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative px-4 py-3 border-b" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 bg-white border shadow-md rounded-md mt-1 max-h-64 overflow-y-auto">
          {suggestions.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelect(user)}
              className="px-4 py-2 text-sm flex items-center gap-2 hover:bg-blue-100 cursor-pointer"
            >
              {user.uploadPic ? (
                <img
                  src={user.uploadPic}
                  alt={user.username}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs uppercase">
                  {user.username[0]}
                </div>
              )}
              <span className="truncate">{user.username}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchDropdown;
