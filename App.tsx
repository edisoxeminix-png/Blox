
import React, { useState, useMemo } from 'react';
import { View, GameExperience, UserProfile, FriendRelation, BuildersClubType } from './types';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Studio from './components/Studio';
import Play from './components/Play';
import AvatarCustomizer from './components/AvatarCustomizer';
import Store from './components/Store';
import Friends from './components/Friends';
import BuildersClub from './components/BuildersClub';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [activeGame, setActiveGame] = useState<GameExperience | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState<BuildersClubType | null>(null);

  const initialUser = useMemo(() => {
    return {
      username: "Bloxer_2026",
      avatarColor: "#0074FF",
      bloxbucks: 250, // Empezamos con poco para motivar el uso de la tienda
      ownedItems: ['item_crown'],
      equippedItems: ['item_crown'],
      outfits: ["Bacon_V5"],
      friends: [
        { username: "Builderman", status: 'online', avatarColor: '#FFD700' },
        { username: "Arceus_Dev", status: 'ingame', avatarColor: '#A855F7' },
      ] as FriendRelation[],
      pendingRequests: [],
      buildersClub: 'None' as BuildersClubType,
      hasArceusX: false, // Ahora se debe comprar
      isAdmin: false
    };
  }, []);

  const [user, setUser] = useState<UserProfile>(initialUser);

  const handlePlayGame = (game: GameExperience) => {
    setActiveGame(game);
    setCurrentView(View.PLAY);
  };

  const upgradeSubscription = (type: BuildersClubType) => {
    let bonus = type === 'Classic' ? 5000 : type === 'Turbo' ? 12000 : 25000;
    setUser(prev => ({ 
      ...prev, 
      buildersClub: type,
      bloxbucks: prev.bloxbucks + bonus 
    }));
    setShowWelcomeModal(type);
    setCurrentView(View.HOME);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfc] text-gray-800 selection:bg-purple-600/10">
      {currentView !== View.PLAY && (
        <Sidebar currentView={currentView} setView={setCurrentView} user={user} />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <div className={`flex-1 ${currentView === View.PLAY ? '' : 'pt-4'}`}>
          {currentView === View.HOME && <Home onPlay={handlePlayGame} />}
          {currentView === View.STUDIO && <div className="pl-24 pr-8"><Studio onPlay={handlePlayGame} user={user} /></div>}
          {currentView === View.PLAY && activeGame && (
            <Play 
              game={activeGame} 
              user={user} 
              onBack={() => setCurrentView(View.HOME)} 
            />
          )}
          {currentView === View.AVATAR && <div className="pl-24 pr-8"><AvatarCustomizer user={user} setUser={setUser} /></div>}
          {currentView === View.STORE && <div className="pl-24 pr-8"><Store user={user} setUser={setUser} /></div>}
          {currentView === View.FRIENDS && <div className="pl-24 pr-8"><Friends user={user} onAccept={() => {}} onDecline={() => {}} onAdd={() => {}} onRemove={() => {}} /></div>}
          {currentView === View.BUILDERS_CLUB && <div className="pl-24 pr-8"><BuildersClub onUpgrade={upgradeSubscription} /></div>}
        </div>
        
        {currentView !== View.PLAY && (
          <footer className="bg-white border-t border-gray-100 py-12 pl-24 text-center text-[10px] text-gray-300 font-black tracking-[0.5em] uppercase">
            <p>© 2026 ARCEUS EVOLUTION | POWERED BY BLOXHAZ AI</p>
          </footer>
        )}
      </main>

      {showWelcomeModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="bg-white p-12 rounded-[3rem] border-4 border-purple-600 shadow-3xl text-center max-w-lg w-full">
            <h2 className="text-4xl font-black italic text-gray-900 mb-8 uppercase tracking-tighter">Bienvenido al Club de Élite</h2>
            <p className="text-gray-500 font-bold mb-10 text-sm uppercase tracking-widest">Has desbloqueado el rango {showWelcomeModal}</p>
            <button 
              onClick={() => setShowWelcomeModal(null)}
              className="w-full bg-purple-600 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:bg-purple-700 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
