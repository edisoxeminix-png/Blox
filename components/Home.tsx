
import React from 'react';
import { GameExperience, BloxObject } from '../types';

interface HomeProps {
  onPlay: (game: GameExperience) => void;
}

const Home: React.FC<HomeProps> = ({ onPlay }) => {
  const RECOMMENDED_GAMES: (GameExperience & { rating: string })[] = [
    {
      id: 'tsunami_tower_v3',
      title: '🌊 Escapa del Tsunami: THE TOWER',
      description: 'Sobrevive subiendo una torre de 5 pisos con parkour dinámico. ¡No toques la lava!',
      creator: 'Braia Studio',
      thumbnail: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop',
      rating: '98%',
      instructions: 'Sigue las flechas de neón. El ático es zona segura.',
      objects: [
        // Base y Suelo
        { id: 'spawn', type: 'box', position: {x: 0, y: 0, z: 0}, color: '#333', size: 10, material: 'slate' },
        
        // Estructura de la Torre (Multicapa)
        { id: 'floor1', type: 'box', position: {x: 25, y: 0, z: 0}, color: '#444', size: 15, material: 'slate' },
        { id: 'wall1', type: 'box', position: {x: 25, y: 7, z: 10}, color: '#555', size: 15, material: 'slate' },
        { id: 'floor2', type: 'box', position: {x: 25, y: 0, z: 15}, color: '#333', size: 12, material: 'slate' },
        { id: 'wall2', type: 'box', position: {x: 25, y: -7, z: 20}, color: '#555', size: 15, material: 'slate' },
        { id: 'floor3', type: 'box', position: {x: 25, y: 0, z: 30}, color: '#222', size: 10, material: 'slate', isSafeZone: true },
        
        // Obstáculos y Escaleras
        { id: 'step1', type: 'box', position: {x: 12, y: 0, z: 4}, color: '#00FFFF', size: 4, material: 'neon' },
        { id: 'step2', type: 'box', position: {x: 18, y: 4, z: 8}, color: '#00FFFF', size: 3, material: 'neon' },
        { id: 'step3', type: 'box', position: {x: 18, y: -4, z: 12}, color: '#00FFFF', size: 3, material: 'neon' },
        { id: 'pillar', type: 'box', position: {x: 25, y: 0, z: 40}, color: '#FFD700', size: 4, material: 'neon' },
        
        // Tsunami
        { id: 'ocean_lava', type: 'lava', position: {x: 0, y: 0, z: -30}, color: '#FF4500', size: 250, material: 'neon' },
        
        // Recompensa
        { id: 'sword_top', type: 'sword', position: {x: 25, y: 0, z: 31}, color: '#FFF', size: 2, isPickable: true },
        { id: 'goal', type: 'goal', position: {x: 25, y: 0, z: 33}, color: '#FFF', size: 6, material: 'forcefield' }
      ]
    },
    {
      id: 'blox_fruits_pro',
      title: '🏴‍☠️ Blox Fruits: Marine Starter',
      description: 'Explora el muelle, sube al barco y encuentra la legendaria fruta Mochi.',
      creator: 'GamerRobot',
      thumbnail: 'https://images.unsplash.com/photo-1519074063912-ad2d605a5c74?q=80&w=800&auto=format&fit=crop',
      rating: '95%',
      instructions: 'La fruta está en el mástil del barco.',
      objects: [
        // EL BARCO PIRATA DETALLADO
        { id: 'hull_main', type: 'box', position: {x: 0, y: 0, z: 0}, color: '#4b2d1f', size: 15, material: 'wood' },
        { id: 'hull_front', type: 'box', position: {x: -10, y: 0, z: 2}, color: '#5d3d2f', size: 10, material: 'wood' },
        { id: 'hull_back', type: 'box', position: {x: 10, y: 0, z: 4}, color: '#3d2419', size: 10, material: 'wood' },
        { id: 'mast', type: 'box', position: {x: 0, y: 0, z: 15}, color: '#2b1a11', size: 3, material: 'wood' },
        { id: 'sail', type: 'box', position: {x: 0, y: 0, z: 22}, color: '#ffffff', size: 12, material: 'plastic' },
        
        // El Muelle y Agua
        { id: 'dock_wood', type: 'box', position: {x: 25, y: 0, z: -1}, color: '#5d3d2f', size: 12, material: 'wood' },
        { id: 'water_sea', type: 'water', position: {x: 10, y: 0, z: -10}, color: '#0066FF', size: 200, material: 'glass' },
        
        // Isla
        { id: 'island', type: 'box', position: {x: 50, y: 0, z: -2}, color: '#228B22', size: 40, material: 'grass' },
        
        // Palmeras
        { id: 'p1_t', type: 'box', position: {x: 45, y: 10, z: 4}, color: '#5d3d2f', size: 3, material: 'wood' },
        { id: 'p1_l', type: 'box', position: {x: 45, y: 10, z: 8}, color: '#00FF00', size: 6, material: 'grass' },
        
        // Fruta
        { id: 'fruit', type: 'sword', position: {x: 0, y: 0, z: 27}, color: '#FF00FF', size: 2, isPickable: true, label: 'MOCHI FRUIT' },
        { id: 'goal', type: 'goal', position: {x: 55, y: 0, z: 2}, color: '#FFD700', size: 8, material: 'forcefield' }
      ]
    },
    {
      id: 'sword_arena_classic',
      title: '🏟️ Arena de Espadas: EL COLISEO',
      description: 'Duelo épico en una arena circular con pilares y armas de poder.',
      creator: 'Knight_Builder',
      thumbnail: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=800&auto=format&fit=crop',
      rating: '94%',
      instructions: 'Recoge las espadas en los pedestales.',
      objects: [
        { id: 'floor', type: 'box', position: {x: 0, y: 0, z: -1}, color: '#222', size: 50, material: 'slate' },
        // Columnas
        { id: 'c1', type: 'box', position: {x: 20, y: 20, z: 10}, color: '#EEE', size: 5, material: 'slate' },
        { id: 'c2', type: 'box', position: {x: -20, y: 20, z: 10}, color: '#EEE', size: 5, material: 'slate' },
        { id: 'c3', type: 'box', position: {x: 20, y: -20, z: 10}, color: '#EEE', size: 5, material: 'slate' },
        { id: 'c4', type: 'box', position: {x: -20, y: -20, z: 10}, color: '#EEE', size: 5, material: 'slate' },
        
        // Pedestales de armas
        { id: 'ped1', type: 'box', position: {x: 10, y: 0, z: 1}, color: '#444', size: 3, material: 'slate' },
        { id: 's1', type: 'sword', position: {x: 10, y: 0, z: 3}, color: '#fff', size: 2, isPickable: true },
        
        { id: 'ped2', type: 'box', position: {x: -10, y: 0, z: 1}, color: '#444', size: 3, material: 'slate' },
        { id: 'h1', type: 'hammer', position: {x: -10, y: 0, z: 3}, color: '#fff', size: 2, isPickable: true },
        
        // Centro
        { id: 'altar', type: 'box', position: {x: 0, y: 0, z: 2}, color: '#00F0FF', size: 6, material: 'neon' },
        { id: 'goal', type: 'goal', position: {x: 0, y: 0, z: 6}, color: '#FFF', size: 4, material: 'forcefield' }
      ]
    }
  ];

  return (
    <div className="pl-24 pr-8 py-8 space-y-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      <section className="flex items-center space-x-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden rotate-2">
           <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=BloxMaster`} alt="UserAvatar" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Descubrir</h1>
          <p className="text-[11px] text-blue-600 font-black tracking-[0.3em] uppercase">Engine RTX 2.5D v8.0</p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-xl font-black text-gray-800 tracking-tight flex items-center space-x-3">
          <span className="bg-red-600 w-2 h-8 rounded-full" />
          <span>Experiencias Premium</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {RECOMMENDED_GAMES.map((game) => (
            <div 
              key={game.id} 
              onClick={() => onPlay(game)}
              className="group cursor-pointer flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
                   <span className="text-[10px] font-black text-gray-900">{game.rating} 👍</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-lg font-black text-gray-900 truncate tracking-tight mb-2 group-hover:text-blue-600 transition-colors uppercase italic">{game.title}</h4>
                <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-4 leading-relaxed">{game.description}</p>
                <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-5">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">By {game.creator}</span>
                   <button className="bg-gray-900 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase hover:bg-blue-600 transition-all shadow-md active:scale-95">Play</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
