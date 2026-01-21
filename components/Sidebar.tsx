
import React from 'react';
import { View, UserProfile } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user }) => {
  const items = [
    { id: View.HOME, label: 'Games' },
    { id: View.STORE, label: 'Catalog' },
    { id: View.STUDIO, label: 'Develop' },
    { id: View.FRIENDS, label: 'People' },
    { id: View.AVATAR, label: 'Character' },
  ];

  const getBCIcon = () => {
    switch (user.buildersClub) {
      case 'Classic': return '👷';
      case 'Turbo': return '🚀';
      case 'Outrageous': return '🎩';
      default: return null;
    }
  };

  return (
    <div className="flex flex-col z-[100]">
      {/* Utility Top Strip */}
      <div className="bg-[#e1e1e1] border-b border-gray-300 h-7 flex items-center justify-end px-4 text-[11px] text-gray-600 space-x-4">
        <div className="flex items-center space-x-1">
          {getBCIcon() && <span title={user.buildersClub + " Builders Club"}>{getBCIcon()}</span>}
          <span>Logged in as <b>{user.username}</b></span>
        </div>
        <span className="text-gray-300">|</span>
        <span 
          onClick={() => setView(View.BUILDERS_CLUB)} 
          className="text-orange-600 cursor-pointer font-bold hover:underline"
        >
          Builders Club
        </span>
        <span className="text-gray-300">|</span>
        <span className="text-blue-700 cursor-pointer font-bold">Logout</span>
      </div>

      {/* Main Blue Header */}
      <header className="classic-gradient h-16 border-b border-[#003366] flex items-center px-4 md:px-10 justify-between">
        <div className="flex items-center space-x-6 h-full">
          {/* Classic Red Logo */}
          <div 
            onClick={() => setView(View.HOME)}
            className="bg-[#d00] border-b-4 border-[#800] px-3 py-1 text-white font-black italic tracking-tighter text-2xl cursor-pointer hover:bg-[#e00] transition-colors"
          >
            BLOX
          </div>

          <nav className="hidden md:flex h-full">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-4 h-full text-sm font-bold transition-all relative ${
                  currentView === item.id 
                    ? 'bg-white/10 text-white border-b-4 border-white' 
                    : 'text-blue-100 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex flex-col items-end">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <span className="text-yellow-400">✧</span>
              <span>{user.bloxbucks.toLocaleString()} Tix</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 font-bold text-[10px]">
              <span className="text-green-400">◎</span>
              <span>0 Robux</span>
            </div>
          </div>
          <div className="w-10 h-10 border-2 border-white/20 bg-gray-200 shadow-inner overflow-hidden flex items-center justify-center" style={{ backgroundColor: user.avatarColor }}>
             {getBCIcon() && <span className="text-xl drop-shadow-sm">{getBCIcon()}</span>}
          </div>
        </div>
      </header>
      
      {/* Sub Header (Mobile Navigation) */}
      <div className="md:hidden bg-white border-b border-gray-300 flex overflow-x-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`px-4 py-2 text-xs font-bold whitespace-nowrap ${
              currentView === item.id ? 'text-[#0055aa] border-b-2 border-[#0055aa]' : 'text-gray-500'
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setView(View.BUILDERS_CLUB)}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap text-orange-600 ${
            currentView === View.BUILDERS_CLUB ? 'border-b-2 border-orange-600' : ''
          }`}
        >
          Builders Club
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
