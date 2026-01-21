
import React, { useState } from 'react';
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
  const [showRealMoneyGateway, setShowRealMoneyGateway] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const buyItem = (price: number) => {
    if (user.bloxbucks >= price) {
      setUser(prev => ({ ...prev, bloxbucks: prev.bloxbucks - price }));
      alert('Item purchased! Check your inventory.');
    } else {
      alert('Not enough Bloxbucks! Earn more by creating games.');
    }
  };

  const handleExecutorPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setUser(prev => ({ ...prev, hasExecutor: true }));
    setIsProcessing(false);
    setShowRealMoneyGateway(false);
    alert('KRNL EXECUTOR UNLOCKED! Press "K" during gameplay to open.');
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
        {/* KRNL SPECIAL ITEM */}
        <div className="bg-gray-900 rounded-3xl p-6 border-4 border-red-600 shadow-xl flex flex-col items-center group transition-all hover:scale-105 relative overflow-hidden">
          <div className="absolute -top-1 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-b uppercase">Hack Pack</div>
          <div className={`w-full aspect-square rounded-2xl bg-gray-800 flex items-center justify-center text-5xl mb-4`}>
            ☣️
          </div>
          <h3 className="font-bold text-lg text-white">KRNL Executor</h3>
          <p className="text-xs text-red-400 mb-4 uppercase tracking-widest font-black">Level 7 Script Hub</p>
          <button
            onClick={() => setShowRealMoneyGateway(true)}
            disabled={user.hasExecutor}
            className={`w-full font-black py-3 rounded-xl flex justify-between px-4 items-center transition-colors ${user.hasExecutor ? 'bg-gray-700 text-gray-500' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            <span>{user.hasExecutor ? 'Owned' : 'Buy Now'}</span>
            <span>$15.00 USD</span>
          </button>
        </div>

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

      {showRealMoneyGateway && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
             <h3 className="text-2xl font-black mb-1">Secure Checkout</h3>
             <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-widest">Blox Bank Verified</p>
             
             {isProcessing ? (
               <div className="py-12 flex flex-col items-center space-y-4">
                 <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                 <p className="text-sm font-black text-gray-800 uppercase animate-pulse">Charging Card...</p>
               </div>
             ) : (
               <form onSubmit={handleExecutorPurchase} className="space-y-4">
                 <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span>KRNL Executor Pro</span>
                       <span className="text-green-600">$15.00</span>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Card Information</label>
                    <input type="text" placeholder="Card Number" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-600 transition-all font-mono" required />
                    <div className="grid grid-cols-2 gap-2">
                       <input type="text" placeholder="MM/YY" className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-600 transition-all" required />
                       <input type="text" placeholder="CVV" className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-600 transition-all" required />
                    </div>
                 </div>
                 <div className="pt-4 flex space-x-2">
                    <button type="button" onClick={() => setShowRealMoneyGateway(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-red-600 text-white font-black rounded-xl shadow-lg hover:bg-red-700 transition-all active:scale-95">Pay $15.00</button>
                 </div>
                 <p className="text-[9px] text-gray-400 text-center font-medium">This is a simulation. No real money will be charged.</p>
               </form>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
