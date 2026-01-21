
import React from 'react';
import { GameExperience } from '../types';

interface HomeProps {
  onPlay: (game: GameExperience) => void;
}

const FEATURED_GAMES: GameExperience[] = [
  {
    id: '1',
    title: 'Lava Run Obby',
    description: '¡El desafío definitivo! Salta sobre las plataformas flotantes. Cuidado: el suelo es lava de verdad.',
    creator: 'BloxMaster',
    thumbnail: 'https://picsum.photos/seed/lava/400/300',
    objects: [
      // Spawn seguro (ID: spawn es crítico para el sistema de inicio)
      { id: 'spawn', type: 'box', position: {x: 0, y: 0, z: 0}, color: '#888888', size: 4 },
      // Circuito de Parkour
      { id: 'p1', type: 'box', position: {x: 8, y: 0, z: 1}, color: '#555555', size: 2 },
      { id: 'p2', type: 'box', position: {x: 14, y: 3, z: 2}, color: '#555555', size: 2 },
      { id: 'p3', type: 'box', position: {x: 14, y: -3, z: 2}, color: '#555555', size: 2 },
      { id: 'p4', type: 'box', position: {x: 20, y: 0, z: 3}, color: '#555555', size: 2 },
      { id: 'p5', type: 'box', position: {x: 26, y: 4, z: 4}, color: '#555555', size: 2 },
      { id: 'p6', type: 'box', position: {x: 32, y: 0, z: 5}, color: '#555555', size: 2 },
      // Meta Dorada
      { id: 'goal', type: 'goal', position: {x: 40, y: 0, z: 6}, color: '#FFD700', size: 4 },
      // El Suelo de Lava (Ajustado para que sea un plano mortal en el fondo)
      // Ponemos el centro muy abajo para que solo la "cima" del cubo sea visible como suelo
      { id: 'lava_floor', type: 'lava', position: {x: 20, y: 0, z: -32}, color: '#FF4500', size: 60 },
    ],
    instructions: 'Usa las flechas o WASD para moverte. Espacio para saltar. ¡Mantén el equilibrio en el aire!'
  },
  {
    id: '2',
    title: 'Neon Odyssey',
    description: 'Explore a futuristic neon city built by AI.',
    creator: 'GeminiBuild',
    thumbnail: 'https://picsum.photos/seed/neon/400/300',
    objects: [
      { id: '1', type: 'box', position: {x: 2, y: 0, z: 2}, color: '#00FFFF', size: 1 },
      { id: '2', type: 'sphere', position: {x: -2, y: 1, z: -2}, color: '#FF00FF', size: 2 },
      { id: '3', type: 'npc', position: {x: 0, y: 0, z: 0}, color: '#FFFFFF', size: 1.5, label: 'Guard' },
    ],
    instructions: 'Find the hidden sphere to win.'
  },
  {
    id: '3',
    title: 'Peaceful Island',
    description: 'A relaxing place to hang out with friends.',
    creator: 'ZenBlox',
    thumbnail: 'https://picsum.photos/seed/island/400/300',
    objects: [],
    instructions: 'Enjoy the view!'
  }
];

const Home: React.FC<HomeProps> = ({ onPlay }) => {
  return (
    <div className="space-y-8">
      {/* 2011 Style Hero Banner */}
      <section className="bg-[#d5e7ff] border border-blue-200 rounded p-6 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-sm">
        <div className="max-w-xl text-[#0055aa] mb-6 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Imagination Platform</h2>
          <p className="text-md opacity-80 mb-6 leading-relaxed">Play, Create, and Imagine. Blox is the best place to be with friends and build the worlds you've always dreamed of.</p>
          <div className="flex space-x-3">
            <button className="bg-[#0055aa] text-white px-8 py-2.5 rounded font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95">
              Play Games
            </button>
            <button className="bg-white text-[#0055aa] border border-blue-200 px-8 py-2.5 rounded font-bold hover:bg-gray-50 shadow-sm transition-all active:scale-95">
              Develop
            </button>
          </div>
        </div>
        <div className="w-full md:w-64 aspect-square bg-white/50 border border-blue-100 rounded-lg shadow-inner flex items-center justify-center text-8xl grayscale opacity-40 select-none">
          🏰
        </div>
      </section>

      {/* Discovery Sections */}
      <section>
        <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
          <h3 className="text-xl font-bold text-gray-800">Featured Games</h3>
          <button className="text-[#0055aa] text-xs font-bold hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_GAMES.map((game) => (
            <div 
              key={game.id} 
              className="bg-white rounded border border-gray-300 shadow-sm overflow-hidden cursor-pointer group hover:border-[#0055aa] transition-all hover:shadow-md"
              onClick={() => onPlay(game)}
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  92% 👍
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-[#0055aa] group-hover:underline">{game.title}</h4>
                <div className="flex items-center mt-1">
                  <span className="text-[10px] text-gray-500 mr-1">By</span>
                  <span className="text-[10px] font-bold text-gray-700 hover:underline">{game.creator}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-[#e8f2ff] p-4 rounded border border-blue-100 text-[10px] text-blue-800 font-bold flex items-center justify-center space-x-4 uppercase tracking-wider">
        <span>2,450,123 Players Online</span>
        <span className="text-blue-200">|</span>
        <span>15,900 Active Games</span>
        <span className="text-blue-200">|</span>
        <span>98% Happy Creators</span>
      </div>
    </div>
  );
};

export default Home;
