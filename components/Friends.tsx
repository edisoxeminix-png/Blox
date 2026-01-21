
import React, { useState } from 'react';
import { UserProfile, FriendRelation } from '../types';

interface FriendsProps {
  user: UserProfile;
  onAccept: (friend: FriendRelation) => void;
  onDecline: (username: string) => void;
  onAdd: (friend: FriendRelation) => void;
  onRemove: (username: string) => void;
}

const MOCK_SEARCH_RESULTS: FriendRelation[] = [
  { username: "RobloxFan2011", status: 'online', avatarColor: '#00FFFF' },
  { username: "Guest666", status: 'offline', avatarColor: '#000000' },
  { username: "ObbyKing", status: 'online', avatarColor: '#FFD700' },
  { username: "NoobKiller99", status: 'ingame', avatarColor: '#33FF57' },
];

const Friends: React.FC<FriendsProps> = ({ user, onAccept, onDecline, onAdd, onRemove }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<FriendRelation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setResults(MOCK_SEARCH_RESULTS.filter(r => 
        r.username.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="bg-[#e8e8e8] px-4 py-2 border-b border-gray-300 flex justify-between items-center">
          <h2 className="font-bold text-[#333]">Search People</h2>
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Classic Finder v2.0</span>
        </div>
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Enter username..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded text-sm focus:outline-none focus:border-[#0055aa]"
            />
            <button 
              type="submit"
              className="bg-[#0055aa] text-white px-6 py-2 rounded font-bold text-sm hover:bg-blue-700 shadow-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {results.length > 0 && (
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="bg-[#f0f8ff] px-4 py-2 border-b border-gray-300">
            <h2 className="font-bold text-[#0055aa] text-sm">Search Results ({results.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {results.map((result) => (
              <div key={result.username} className="border border-gray-200 p-3 rounded hover:bg-gray-50 flex flex-col items-center">
                <div className="w-16 h-16 rounded border border-gray-300 shadow-inner mb-2" style={{ backgroundColor: result.avatarColor }} />
                <p className="font-bold text-sm mb-1">{result.username}</p>
                <button 
                  onClick={() => onAdd(result)}
                  className="text-[10px] bg-green-600 text-white px-3 py-1 rounded font-bold hover:bg-green-700"
                >
                  Add Friend
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.pendingRequests.length > 0 && (
        <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-[#ffeded] px-4 py-2 border-b border-gray-300">
            <h2 className="font-bold text-[#aa0000] text-sm">Friend Requests ({user.pendingRequests.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {user.pendingRequests.map((request) => (
              <div key={request.username} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded border border-gray-200" style={{ backgroundColor: request.avatarColor }} />
                  <div>
                    <p className="font-bold text-sm">{request.username}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Wants to be your friend</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onAccept(request)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => onDecline(request.username)}
                    className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-xs font-bold hover:bg-gray-300"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
        <div className="bg-[#f2f2f2] px-4 py-2 border-b border-gray-300 flex justify-between items-center">
          <h2 className="font-bold text-gray-700 text-sm">My Friends ({user.friends.length})</h2>
          <div className="flex space-x-4 text-[10px] font-bold uppercase">
            <span className="text-green-600">Online: {user.friends.filter(f => f.status !== 'offline').length}</span>
            <span className="text-gray-400">Total: {user.friends.length}</span>
          </div>
        </div>
        
        {user.friends.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <p className="text-3xl mb-2">👤</p>
            <p className="text-sm">You haven't added any friends yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0 border-t border-gray-100">
            {user.friends.map((friend) => (
              <div key={friend.username} className="border-r border-b border-gray-100 p-4 hover:bg-[#fafafa] group relative">
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <div className="w-20 h-20 rounded border border-gray-200 shadow-sm" style={{ backgroundColor: friend.avatarColor }} />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      friend.status === 'online' ? 'bg-green-500' : 
                      friend.status === 'ingame' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <p className="font-bold text-xs truncate w-full text-center">{friend.username}</p>
                  <p className={`text-[9px] font-bold uppercase ${
                    friend.status === 'online' ? 'text-green-600' : 
                    friend.status === 'ingame' ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {friend.status === 'ingame' ? 'Playing Blox' : friend.status}
                  </p>
                  
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button className="bg-blue-100 text-[#0055aa] p-1 rounded hover:bg-blue-200" title="Message">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                    </button>
                    <button 
                      onClick={() => onRemove(friend.username)}
                      className="bg-red-100 text-red-600 p-1 rounded hover:bg-red-200" title="Unfriend"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#ffffdd] border border-[#e6e600] p-4 rounded text-xs text-yellow-900 shadow-sm">
        <p className="font-bold mb-1">Safety First!</p>
        <p>Never share your password with anyone, even if they claim to be a Blox administrator. Be kind to your friends!</p>
      </div>
    </div>
  );
};

export default Friends;
