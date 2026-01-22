
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface StoreProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const ITEMS = [
  { id: 'item_wings', name: 'Cyber Wings', price: 500, icon: '🦋', color: 'bg-blue-900/40' },
  { id: 'item_crown', name: 'RTX Crown', price: 1200, icon: '👑', color: 'bg-yellow-900/40' },
  { id: 'item_jetpack', name: 'Pro Jetpack', price: 2000, icon: '🚀', color: 'bg-red-900/40' },
];

const Store: React.FC<StoreProps> = ({ user, setUser }) => {
  const [checkoutItem, setCheckoutItem] = useState<{id: string, name: string, price: string, type: 'admin' | 'arceus'} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const buyItem = (item: typeof ITEMS[0]) => {
    if (user.ownedItems.includes(item.id)) return alert('Ya tienes este objeto.');
    if (user.bloxbucks >= item.price) {
      setUser(prev => ({ 
        ...prev, 
        bloxbucks: prev.bloxbucks - item.price,
        ownedItems: [...prev.ownedItems, item.id]
      }));
      alert(`¡${item.name} comprado!`);
    } else alert('Bloxbucks insuficientes.');
  };

  const handlePaidPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    
    if (checkoutItem?.type === 'admin') {
      setUser(prev => ({ ...prev, isAdmin: true }));
      alert('ADMIN UNLOCKED!');
    } else if (checkoutItem?.type === 'arceus') {
      setUser(prev => ({ ...prev, hasArceusX: true }));
      alert('ARCEUS X NEO V5 ACTIVADO! Abre el juego para usarlo.');
    }
    
    setIsProcessing(false);
    setCheckoutItem(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">Blox Market 2026</h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Next-Gen Assets & Tools</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] border border-gray-100 flex items-center space-x-3 shadow-xl">
          <span className="text-2xl">💰</span>
          <span className="text-2xl font-black italic text-gray-800">{user.bloxbucks.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* ARCEUS X NEO V5 - THE MAIN ITEM */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black border-4 border-purple-500/50 rounded-[3rem] p-8 shadow-2xl flex flex-col items-center group relative overflow-hidden transition-all hover:-translate-y-3">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 blur-3xl rounded-full" />
          <div className="text-6xl mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">🔱</div>
          <h3 className="font-black text-2xl text-white uppercase italic tracking-tighter text-center">Arceus X Neo V5</h3>
          <p className="text-[9px] text-purple-300 mb-8 uppercase tracking-[0.3em] font-black text-center mt-2">Professional Script Executor</p>
          
          <div className="space-y-2 mb-8 w-full">
            <div className="flex items-center text-[8px] text-white/60 uppercase font-black space-x-2">
              <span className="text-purple-500">✔</span> <span>Anti-Ban Protection</span>
            </div>
            <div className="flex items-center text-[8px] text-white/60 uppercase font-black space-x-2">
              <span className="text-purple-500">✔</span> <span>Cloud Script Hub</span>
            </div>
          </div>

          <button
            onClick={() => setCheckoutItem({ id: 'arceus_v5', name: 'Arceus X Neo V5 (Full Access)', price: '$19.99', type: 'arceus' })}
            disabled={user.hasArceusX}
            className={`w-full font-black py-4 rounded-2xl flex justify-between px-6 items-center transition-all ${user.hasArceusX ? 'bg-white/10 text-white/30' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.4)] active:scale-95'}`}
          >
            <span className="text-xs italic uppercase">{user.hasArceusX ? 'Ya lo tienes' : 'Comprar V5'}</span>
            <span className="text-xs">$19.99</span>
          </button>
        </div>

        {/* ADMIN RANK */}
        <div className="bg-white border-2 border-yellow-400 rounded-[3rem] p-8 shadow-xl flex flex-col items-center group transition-all hover:-translate-y-2">
          <div className="text-5xl mb-6">👑</div>
          <h3 className="font-black text-xl text-gray-900 uppercase italic tracking-tighter">Admin Power</h3>
          <p className="text-[9px] text-yellow-600 mb-8 uppercase tracking-widest font-black text-center mt-2">Exclusive Server Access</p>
          <button
            onClick={() => setCheckoutItem({ id: 'rank_admin', name: 'Rango Admin Global', price: '$29.99', type: 'admin' })}
            disabled={user.isAdmin}
            className={`w-full font-black py-4 rounded-2xl flex justify-between px-6 items-center transition-all ${user.isAdmin ? 'bg-gray-100 text-gray-400' : 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg active:scale-95'}`}
          >
            <span className="text-xs italic uppercase">Adquirir</span>
            <span className="text-xs">$29.99</span>
          </button>
        </div>

        {ITEMS.map(item => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-[3rem] p-8 flex flex-col items-center group transition-all hover:shadow-2xl hover:-translate-y-2">
            <div className={`w-24 h-24 rounded-3xl ${item.color} flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
              {item.icon}
            </div>
            <h3 className="font-black text-lg text-gray-900 italic uppercase tracking-tighter">{item.name}</h3>
            <p className="text-[9px] text-gray-400 mb-8 uppercase tracking-widest font-black mt-2">Avatar Accessory</p>
            <button
              onClick={() => buyItem(item)}
              disabled={user.ownedItems.includes(item.id)}
              className={`w-full font-black py-4 rounded-2xl flex justify-between px-6 items-center transition-all ${user.ownedItems.includes(item.id) ? 'bg-gray-50 text-gray-400' : 'bg-black text-white hover:bg-gray-800 shadow-xl active:scale-95'}`}
            >
              <span className="text-xs italic uppercase">{user.ownedItems.includes(item.id) ? 'Poseído' : 'Comprar'}</span>
              <span className="text-xs">💰 {item.price}</span>
            </button>
          </div>
        ))}
      </div>

      {checkoutItem && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl relative overflow-hidden border border-white/20">
             <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-6">Checkout Seguro</h3>
             {isProcessing ? (
               <div className="py-16 flex flex-col items-center space-y-6 text-center">
                 <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(147,51,234,0.3)]" />
                 <p className="text-xs font-black text-purple-600 uppercase tracking-[0.3em] animate-pulse">Autorizando Transacción...</p>
               </div>
             ) : (
               <form onSubmit={handlePaidPurchase} className="space-y-6">
                 <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex justify-between items-center shadow-inner">
                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">{checkoutItem.name}</span>
                    <span className="text-green-600 font-black text-2xl tracking-tighter">{checkoutItem.price}</span>
                 </div>
                 <div className="space-y-3">
                    <input type="text" placeholder="CARD NUMBER" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-xs outline-none focus:border-purple-400 transition-all shadow-sm" required />
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="MM/YY" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-xs outline-none focus:border-purple-400 transition-all shadow-sm" required />
                        <input type="text" placeholder="CVV" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-xs outline-none focus:border-purple-400 transition-all shadow-sm" required />
                    </div>
                 </div>
                 <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setCheckoutItem(null)} className="flex-1 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest hover:text-gray-600 transition-colors">Volver</button>
                    <button type="submit" className="flex-[2] py-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl hover:bg-purple-700 uppercase tracking-widest italic text-xs active:scale-95">Confirmar Pago</button>
                 </div>
               </form>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
