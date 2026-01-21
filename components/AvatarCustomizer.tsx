
import React from 'react';
import { UserProfile } from '../types';

interface AvatarProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const COLORS = [
  '#0074FF', '#FF5733', '#33FF57', '#FF33A1', '#FFD700', 
  '#800080', '#000000', '#FFFFFF', '#00FFFF', '#FF00FF'
];

const AvatarCustomizer: React.FC<AvatarProps> = ({ user, setUser }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-black mb-8">Customize Your Blox</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Preview Area */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="relative w-48 h-64 flex flex-col items-center">
            {/* Head */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg mb-1" />
            {/* Body */}
            <div 
              className="w-32 h-32 rounded-xl shadow-lg transition-colors" 
              style={{ backgroundColor: user.avatarColor }}
            />
            {/* Legs */}
            <div className="flex space-x-1 mt-1">
              <div className="w-14 h-20 bg-gray-300 rounded-b-lg" />
              <div className="w-14 h-20 bg-gray-300 rounded-b-lg" />
            </div>
            {/* Accessories Placeholder */}
            <div className="absolute top-4 w-full flex justify-center">
              <div className="w-20 h-4 bg-black/20 rounded-full" />
            </div>
          </div>
          <p className="mt-8 font-bold text-gray-500">{user.username}</p>
        </div>

        {/* Customization Options */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4">Body Color</h3>
            <div className="grid grid-cols-5 gap-3">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setUser(prev => ({ ...prev, avatarColor: color }))}
                  className={`w-12 h-12 rounded-full border-4 transition-all ${user.avatarColor === color ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4">Saved Outfits</h3>
            <div className="grid grid-cols-2 gap-4">
              {user.outfits.map(outfit => (
                <button
                  key={outfit}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition-all text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">👕</div>
                  <div>
                    <p className="font-bold text-sm">{outfit}</p>
                    <p className="text-xs text-gray-400">Custom Wear</p>
                  </div>
                </button>
              ))}
              <button className="flex items-center justify-center space-x-3 p-4 bg-blue-50 text-blue-600 rounded-2xl border-2 border-dashed border-blue-200 hover:bg-blue-100 transition-all">
                <span className="font-bold text-sm">+ Save New</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
