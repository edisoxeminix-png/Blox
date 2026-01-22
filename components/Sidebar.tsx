
import React from 'react';
import { View, UserProfile } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  user: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user }) => {
  const navItems = [
    { id: View.HOME, label: 'Inicio', icon: '🏠' },
    { id: View.STORE, label: 'Tienda', icon: '🛍️' },
    { id: View.AVATAR, label: 'Avatar', icon: '👤' },
    { id: View.STUDIO, label: 'Equipo', icon: '🛠️' },
    { id: View.BUILDERS_CLUB, label: 'Más', icon: '⋯' },
  ];

  return (
    <div className="flex flex-col z-[100]">
      {/* Top Header Bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between sticky top-0 z-[110] shadow-sm">
        <div className="flex items-center space-x-4 w-1/4">
           <div className="text-xl font-black italic text-gray-900 tracking-tighter uppercase select-none">BLOX</div>
        </div>

        {/* Search Bar centralizada */}
        <div className="flex-1 max-w-lg relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            placeholder="Buscar" 
            className="w-full bg-gray-50 border border-gray-100 rounded-full py-2 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Iconos Superiores Derecha */}
        <div className="w-1/4 flex justify-end items-center space-x-5">
          <div className="flex items-center space-x-1.5 cursor-pointer hover:bg-gray-50 p-1.5 px-3 rounded-full border border-transparent hover:border-gray-100 transition-all">
            <span className="text-lg">💰</span>
            <span className="text-xs font-black text-gray-800 tracking-tight">{user.bloxbucks.toLocaleString()}</span>
          </div>
          <div className="relative cursor-pointer hover:bg-gray-50 p-2 rounded-full transition-all">
            <span className="text-xl">🔔</span>
            <div className="absolute top-1 right-1 bg-red-600 text-[8px] text-white font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">5</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 border border-white shadow-sm flex items-center justify-center text-[10px] text-white font-black overflow-hidden">
             <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} alt="AvatarSmall" />
          </div>
        </div>
      </header>

      {/* Side Navigation exacto al de la imagen */}
      <aside className="fixed left-0 top-14 bottom-0 w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 space-y-7 shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center space-y-1 w-full relative transition-all duration-300 ${currentView === item.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {/* Indicador sutil de selección vertical */}
            {currentView === item.id && (
              <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            )}
            <span className={`text-2xl transition-transform ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
            <span className={`text-[10px] font-black uppercase tracking-tight ${currentView === item.id ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
          </button>
        ))}
      </aside>
    </div>
  );
};

export default Sidebar;
