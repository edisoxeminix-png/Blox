
import React, { useState } from 'react';
import { BuildersClubType } from '../types';

interface BuildersClubProps {
  onUpgrade: (type: BuildersClubType) => void;
}

const BuildersClub: React.FC<BuildersClubProps> = ({ onUpgrade }) => {
  const [showPayment, setShowPayment] = useState<BuildersClubType | null>(null);
  const [formData, setFormData] = useState({ card: '', expiry: '', cvv: '' });

  const plans = [
    { 
      type: 'Classic' as BuildersClubType, 
      price: '$5.95', 
      benefits: ['15 Daily Tix', '10 Active Games', 'Exclusive Classic Badge'],
      color: 'bg-orange-100 border-orange-400 text-orange-800',
      btnColor: 'bg-orange-600 hover:bg-orange-700'
    },
    { 
      type: 'Turbo' as BuildersClubType, 
      price: '$11.95', 
      benefits: ['35 Daily Tix', '25 Active Games', 'Gear: Turbo Jetpack'],
      color: 'bg-blue-100 border-blue-400 text-blue-800',
      btnColor: 'bg-blue-600 hover:bg-blue-700'
    },
    { 
      type: 'Outrageous' as BuildersClubType, 
      price: '$19.95', 
      benefits: ['60 Daily Tix', '100 Active Games', 'Gear: Outrageous Hat'],
      color: 'bg-red-100 border-red-400 text-red-800',
      btnColor: 'bg-red-600 hover:bg-red-700'
    }
  ];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (showPayment) {
      alert(`Success! You are now a ${showPayment} Builders Club member.`);
      onUpgrade(showPayment);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black italic tracking-tighter text-orange-600 drop-shadow-sm uppercase">Builders Club</h1>
        <p className="text-xl text-gray-600 font-bold">The ultimate construction experience for dedicated bloxers.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.type} className={`border-2 rounded-2xl p-8 flex flex-col ${plan.color} shadow-lg transition-transform hover:-translate-y-2`}>
            <h2 className="text-3xl font-black mb-2">{plan.type}</h2>
            <div className="text-4xl font-black mb-6">{plan.price}<span className="text-sm opacity-60">/mo</span></div>
            <ul className="space-y-3 mb-10 flex-1">
              {plan.benefits.map(b => (
                <li key={b} className="flex items-center font-bold text-sm">
                  <span className="mr-2 text-xl">✅</span> {b}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setShowPayment(plan.type)}
              className={`w-full text-white font-black py-4 rounded-xl shadow-md uppercase tracking-widest ${plan.btnColor}`}
            >
              Upgrade Now
            </button>
          </div>
        ))}
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black mb-6">Payment for {showPayment} BC</h3>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  className="w-full border-2 border-gray-100 p-4 rounded-xl focus:border-orange-500 outline-none font-mono"
                  value={formData.card}
                  onChange={e => setFormData({...formData, card: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Expiry</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    className="w-full border-2 border-gray-100 p-4 rounded-xl focus:border-orange-500 outline-none"
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">CVV</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    className="w-full border-2 border-gray-100 p-4 rounded-xl focus:border-orange-500 outline-none"
                    value={formData.cvv}
                    onChange={e => setFormData({...formData, cvv: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="pt-4 flex space-x-3">
                 <button 
                  type="button" 
                  onClick={() => setShowPayment(null)}
                  className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700"
                >
                  Pay Now
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-4 italic">Note: This is a simulation. Do not enter real credit card details.</p>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl p-10 flex items-center space-x-8 shadow-sm">
        <div className="text-7xl">👷‍♂️</div>
        <div>
          <h4 className="text-2xl font-black mb-2">Why join Builders Club?</h4>
          <p className="text-gray-500 font-medium">Builders Club is for the creators who want more. Get a daily allowance of Tix, create more worlds, and get exclusive virtual items for your character. It's how you show everyone you're a serious Bloxer!</p>
        </div>
      </div>
    </div>
  );
};

export default BuildersClub;
