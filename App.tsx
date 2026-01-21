
import React, { useState } from 'react';
import { View, GameExperience, UserProfile, FriendRelation, BuildersClubType } from './types';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Studio from './components/Studio';
import Play from './components/Play';
import AvatarCustomizer from './components/AvatarCustomizer';
import Store from './components/Store';
import Friends from './components/Friends';
import BuildersClub from './components/BuildersClub';

const INITIAL_FRIENDS: FriendRelation[] = [
  { username: "NexusBuilder", status: 'online', avatarColor: '#00F0FF' },
  { username: "QuantumCode", status: 'ingame', avatarColor: '#FF00FF' },
  { username: "CyberGhost", status: 'offline', avatarColor: '#33FF57' },
];

const DEFAULT_USER: UserProfile = {
  username: "NeoUser_2011",
  avatarColor: "#0074FF",
  bloxbucks: 500,
  outfits: ["ClassicNoob", "SwordFighter"],
  friends: INITIAL_FRIENDS,
  pendingRequests: [
    { username: "AlphaZero", status: 'online', avatarColor: '#FFFFFF' }
  ],
  buildersClub: 'None',
  hasExecutor: false
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [activeGame, setActiveGame] = useState<GameExperience | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState<BuildersClubType | null>(null);

  const handlePlayGame = (game: GameExperience) => {
    setActiveGame(game);
    setCurrentView(View.PLAY);
  };

  const upgradeSubscription = (type: BuildersClubType) => {
    let bonus = 0;
    if (type === 'Classic') bonus = 5000;
    if (type === 'Turbo') bonus = 12000;
    if (type === 'Outrageous') bonus = 25000;

    setUser(prev => ({ 
      ...prev, 
      buildersClub: type,
      bloxbucks: prev.bloxbucks + bonus 
    }));
    
    setShowWelcomeModal(type);
    setCurrentView(View.HOME);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f2f2f2] text-[#333]">
      <Sidebar currentView={currentView} setView={setCurrentView} user={user} />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex-1">
          {currentView === View.HOME && <Home onPlay={handlePlayGame} />}
          {currentView === View.STUDIO && <Studio onPlay={handlePlayGame} user={user} />}
          {currentView === View.PLAY && activeGame && <Play game={activeGame} user={user} onBack={() => setCurrentView(View.HOME)} />}
          {currentView === View.AVATAR && <AvatarCustomizer user={user} setUser={setUser} />}
          {currentView === View.STORE && <Store user={user} setUser={setUser} />}
          {currentView === View.FRIENDS && <Friends user={user} onAccept={() => {}} onDecline={() => {}} onAdd={() => {}} onRemove={() => {}} />}
          {currentView === View.BUILDERS_CLUB && <BuildersClub onUpgrade={upgradeSubscription} />}
        </div>
        
        <footer className="bg-white border-t border-gray-300 py-6 text-center text-[11px] text-gray-500">
          <p>© 2011 Blox Corporation. All rights reserved. | Terms of Service | Privacy Policy</p>
          <div className="mt-2 flex justify-center space-x-4 font-bold text-[#0055aa]">
            <a href="#">About Us</a>
            <a href="#">Jobs</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
        </footer>
      </main>

      {showWelcomeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white p-10 rounded-3xl border-4 border-orange-500 shadow-2xl text-center max-w-lg w-full animate-in zoom-in-90 duration-300">
            <div className="text-8xl mb-6">
              {showWelcomeModal === 'Classic' ? '👷' : showWelcomeModal === 'Turbo' ? '🚀' : '🎩'}
            </div>
            <h2 className="text-4xl font-black italic text-orange-600 mb-2 uppercase">Welcome to the Club!</h2>
            <p className="text-gray-600 font-bold text-lg mb-6">
              You are now an official <span className="text-black font-black">{showWelcomeModal} Builders Club</span> member.
            </p>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-8">
              <p className="text-xs font-black uppercase text-orange-800 mb-1">Membership Bonus Added</p>
              <p className="text-2xl font-black text-orange-600">+ {showWelcomeModal === 'Classic' ? '5,000' : showWelcomeModal === 'Turbo' ? '12,000' : '25,000'} Tix</p>
            </div>
            <button 
              onClick={() => setShowWelcomeModal(null)}
              className="w-full bg-orange-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-orange-700 active:scale-95 transition-all uppercase tracking-widest"
            >
              Start Building
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
