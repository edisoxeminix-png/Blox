
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AvatarProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const COLORS = ['#0074FF', '#FF5733', '#33FF57', '#FF33A1', '#FFD700', '#000000', '#FFFFFF'];

const ITEM_DATA = {
  'item_wings': { name: 'Cyber Wings', icon: '🦋' },
  'item_crown': { name: 'RTX Crown', icon: '👑' },
  'item_jetpack': { name: 'Pro Jetpack', icon: '🚀' },
  'item_aura': { name: 'Ghost Aura', icon: '👻' },
  'item_trail': { name: 'Neon Trail', icon: '✨' },
  'item_arm': { name: 'Bionic Arm', icon: '🦾' }
};

const AvatarCustomizer: React.FC<AvatarProps> = ({ user, setUser }) => {
  const [rotation, setRotation] = useState(-30);

  useEffect(() => {
    const interval = setInterval(() => setRotation(r => r + 0.5), 30);
    return () => clearInterval(interval);
  }, []);

  const toggleItem = (itemId: string) => {
    setUser(prev => {
      const isEquipped = prev.equippedItems.includes(itemId);
      const newEquipped = isEquipped 
        ? prev.equippedItems.filter(id => id !== itemId)
        : [...prev.equippedItems, itemId];
      return { ...prev, equippedItems: newEquipped };
    });
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <h2 className="text-4xl font-black mb-10 italic uppercase tracking-tighter text-gray-900">Personalizador de Bloxer</h2>
      
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 bg-white rounded-[3rem] p-12 shadow-xl border border-gray-100 flex flex-col items-center relative overflow-hidden h-[600px] group">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent" />
          
          <div className="relative z-10 w-full h-full flex items-center justify-center" style={{ perspective: '1200px' }}>
            <div style={{ 
                transformStyle: 'preserve-3d', 
                transform: `rotateX(60deg) rotateZ(${rotation}deg) scale(2.8)`,
                transition: 'transform 0.1s linear'
            }}>
                <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: 'translate3d(-50%, -50%, 0)' }}>
                    {/* CABEZA */}
                    <div style={{ position: 'absolute', width: 25, height: 25, transform: 'translate3d(5px, 5px, 60px)', backgroundColor: '#FFDBAC', border: '1px solid #d4a373', transformStyle: 'preserve-3d' }}>
                        <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#FFDBAC', transform: 'translateZ(25px)' }} />
                        {/* Cabello Simulado */}
                        <div style={{ position: 'absolute', width: 28, height: 10, backgroundColor: '#5d3a1a', transform: 'translate3d(-1.5px, -1.5px, 25px)' }} />
                        {/* Corona */}
                        {user.equippedItems.includes('item_crown') && (
                           <div style={{ position: 'absolute', width: 20, height: 15, backgroundColor: '#FFD700', transform: 'translate3d(-5px, -5px, 35px) rotateZ(15deg)' }} />
                        )}
                    </div>
                    {/* TORSO (Chaqueta) */}
                    <div style={{ position: 'absolute', width: 45, height: 25, transform: 'translate3d(-5px, 7.5px, 25px)', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', transformStyle: 'preserve-3d' }}>
                        <div style={{ position: 'absolute', width: 20, height: '100%', backgroundColor: '#0074FF', transform: 'translate3d(12.5px, 0, 30px)' }} />
                        <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#111', transform: 'translateZ(30px)', opacity: 0.8 }} />
                    </div>
                    {/* PIERNAS */}
                    <div style={{ position: 'absolute', width: 18, height: 20, transform: 'translate3d(-4px, 10px, 0px)', backgroundColor: '#FFF', transformStyle: 'preserve-3d' }}>
                        <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#FFF', transform: 'translateZ(25px)' }} />
                    </div>
                    <div style={{ position: 'absolute', width: 18, height: 20, transform: 'translate3d(21px, 10px, 0px)', backgroundColor: '#FFF', transformStyle: 'preserve-3d' }}>
                        <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#FFF', transform: 'translateZ(25px)' }} />
                    </div>
                </div>
            </div>
          </div>

          <div className="mt-auto relative z-20 text-center">
             <div className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black italic tracking-tighter uppercase text-sm shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
               {user.username}
             </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
            <h3 className="font-black text-xl mb-8 uppercase italic tracking-tighter text-gray-800">Color de Base</h3>
            <div className="flex flex-wrap gap-5">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setUser(prev => ({ ...prev, avatarColor: color }))}
                  className={`w-14 h-14 rounded-2xl border-4 transition-all ${user.avatarColor === color ? 'border-purple-500 scale-110 shadow-lg' : 'border-transparent shadow-sm hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-black text-xl uppercase italic tracking-tighter text-gray-800">Equipamiento RTX</h3>
               <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">{user.ownedItems.length} OBJETOS</span>
            </div>
            {user.ownedItems.length === 0 ? (
               <div className="py-16 text-center text-gray-400 font-bold uppercase text-[12px] tracking-[0.3em] border-4 border-dashed border-gray-50 rounded-3xl">
                 Sin objetos en el inventario
               </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {user.ownedItems.map(itemId => {
                  const item = ITEM_DATA[itemId as keyof typeof ITEM_DATA];
                  if (!item) return null;
                  const isEquipped = user.equippedItems.includes(itemId);
                  return (
                    <button
                      key={itemId}
                      onClick={() => toggleItem(itemId)}
                      className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all group ${isEquipped ? 'bg-purple-50 border-purple-400 shadow-inner' : 'bg-gray-50 border-transparent hover:border-gray-200'}`}
                    >
                      <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</span>
                      <p className="font-black text-[10px] uppercase tracking-tighter text-gray-800 text-center mb-1">{item.name}</p>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${isEquipped ? 'text-purple-600' : 'text-gray-400'}`}>
                        {isEquipped ? 'EQUIPADO' : 'USAR'}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
