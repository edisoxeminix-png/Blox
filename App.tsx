
import React, { useState } from 'react';
import { View, GameExperience, UserProfile, FriendRelation } from './types';
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
  bloxbucks: 25000,
  outfits: ["ClassicNoob", "SwordFighter"],
  friends: INITIAL_FRIENDS,
  pendingRequests: [
    { username: "AlphaZero", status: 'online', avatarColor: '#FFFFFF' }
  ],
  buildersClub: 'None'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [activeGame, setActiveGame] = useState<GameExperience | null>(null);

  const handlePlayGame = (game: GameExperience) => {
    setActiveGame(game);
    setCurrentView(View.PLAY);
  };

  const upgradeSubscription = (type: UserProfile['buildersClub']) => {
    setUser(prev => ({ ...prev, buildersClub: type }));
    setCurrentView(View.HOME);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f2f2f2] text-[#333]">
      {/* Top Bar - 2011 Style */}
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
        
        {/* Footer 2011 */}
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
    </div>
  );
};

export default App;
