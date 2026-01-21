
import React from 'react';
import { UserProfile } from '../types';

interface StoreProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const ITEMS = [
  { id: '1', name: 'Super Wings', price: 500, icon: '🦋', color: 'bg-blue-100' },
  { id: '2', name: 'Golden Crown', price: 1200, icon: '👑', color: 'bg-yellow-100' },
  { id: '3', name: 'Neon Trail', price: 350, icon: '✨', color: 'bg-purple-100' },
  { id: '4', name: 'Robo Arm', price: 800, icon: '🦾', color: 'bg-gray-100' },
  { id: '5', name: 'Fire Aura', price: 1500, icon: '🔥', color: 'bg-red-100' },
  { id: '6', name: 'Jetpack', price: 2000, icon: '🚀', color: 'bg-green-100' },
];

const Store: React.FC<StoreProps> = ({ user, setUser }) => {
  const buyItem = (price: number) => {
    if (user.bloxbucks >= price) {
      setUser(prev => ({ ...prev, bloxbucks: prev.bloxbucks - price }));
      alert('Item purchased! Check your inventory.');
    } else {
      alert('Not enough Bloxbucks! Earn more by creating games.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black">Avatar Store</h2>
          <p className="text-gray-500">Drip out your blox with exclusive items.</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-6 py-2 rounded-2xl text-xl font-black">
          💰 {user.bloxbucks}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {ITEMS.map(item => (
          <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center group transition-all hover:shadow-md">
            <div className={`w-full aspect-square rounded-2xl ${item.color} flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-xs text-gray-400 mb-4 uppercase tracking-tighter">Limited Edition</p>
            <button
              onClick={() => buyItem(item.price)}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl flex justify-between px-4 items-center hover:bg-blue-600 transition-colors"
            >
              <span>Buy</span>
              <span>💰 {item.price}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-600 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
        <div className="z-10 text-center md:text-left mb-6 md:mb-0">
          <h3 className="text-3xl font-black mb-2">Need More Bloxbucks?</h3>
          <p className="text-blue-100 max-w-sm">Join the Builders Club or sell your own items in the studio to earn more currency!</p>
          <button className="mt-6 bg-white text-blue-600 px-8 py-3 rounded-full font-bold">Get Bloxbucks</button>
        </div>
        <div className="text-8xl opacity-20 transform rotate-12 select-none z-0">
          💰💰💰
        </div>
      </div>
    </div>
  );
};

export default Store;
