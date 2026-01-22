
import React, { useState } from 'react';
import { generateGameThumbnail } from '../services/geminiService';
import { GameExperience, BloxObject, UserProfile, BloxMaterial } from '../types';

interface StudioProps {
  onPlay: (game: GameExperience) => void;
  user: UserProfile;
}

const Studio: React.FC<StudioProps> = ({ onPlay, user }) => {
  const [gameTitle, setGameTitle] = useState('');
  const [gameDesc, setGameDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<GameExperience | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const handleCreateNewGame = async () => {
    if (!gameTitle.trim()) return;
    setIsGenerating(true);
    try {
      const thumbnail = await generateGameThumbnail(gameTitle);
      const newGame: GameExperience = {
        id: Math.random().toString(36).substr(2, 9),
        title: gameTitle,
        description: gameDesc || 'Creación manual en Blox Studio 2026',
        creator: user.username,
        thumbnail: thumbnail,
        objects: [{ id: 'spawn', type: 'box', position: { x: 0, y: 0, z: 0 }, color: '#222222', size: 4, material: 'slate' }],
        instructions: '¡Construye bloque a bloque!'
      };
      setGeneratedGame(newGame);
      setSelectedObjectId('spawn');
    } catch (error) {
      alert('Error al iniciar el motor de construcción.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addObject = (type: any) => {
    if (!generatedGame) return;
    const newId = 'obj-' + Math.random().toString(36).substr(2, 5);
    const newObj: BloxObject = { 
      id: newId, type: type, 
      position: { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10, z: 2 }, 
      color: type === 'lava' ? '#FF0000' : type === 'water' ? '#0066FF' : '#FFFFFF', 
      size: 2, material: 'plastic' 
    };
    setGeneratedGame({ ...generatedGame, objects: [...generatedGame.objects, newObj] });
    setSelectedObjectId(newId);
  };

  const updateObject = (id: string, updates: any) => {
    if (!generatedGame) return;
    setGeneratedGame({
      ...generatedGame,
      objects: generatedGame.objects.map(obj => obj.id === id ? { ...obj, ...updates } : obj)
    });
  };

  const selectedObject = generatedGame?.objects.find(o => o.id === selectedObjectId);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="bg-black/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-900 rounded-3xl flex items-center justify-center text-3xl shadow-lg animate-pulse">🛠️</div>
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">STUDIO <span className="text-red-600">EVO</span></h2>
            <p className="text-gray-500 font-black uppercase text-[9px] tracking-[0.4em]">Advanced Editor V4.0</p>
          </div>
        </div>
      </div>

      {!generatedGame ? (
        <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Nuevo Proyecto</h3>
            <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Inicia tu creación manual</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Nombre del Juego</label>
              <input type="text" value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} placeholder="BLOXY ADVENTURE" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white font-black italic text-lg focus:border-red-600 outline-none transition-all placeholder:text-white/10 shadow-inner" />
            </div>
            <textarea value={gameDesc} onChange={(e) => setGameDesc(e.target.value)} placeholder="DESCRIPCIÓN" className="w-full h-24 p-4 bg-black border border-white/10 rounded-xl text-white font-medium text-xs focus:border-red-600 outline-none transition-all placeholder:text-white/10 resize-none shadow-inner" />
          </div>
          <button onClick={handleCreateNewGame} disabled={isGenerating || !gameTitle.trim()} className="w-full bg-white text-black font-black py-3 rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all active:scale-95 uppercase tracking-[0.3em] disabled:opacity-20 text-xs">
            {isGenerating ? "INICIANDO..." : "EMPEZAR A CONSTRUIR"}
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl">
               <img src={generatedGame.thumbnail} className="w-full h-full object-cover opacity-50 blur-sm" />
               <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{generatedGame.title}</h3>
                    <p className="text-red-500 font-black text-[9px] tracking-widest uppercase">Modo Edición Live</p>
                  </div>
                  <button onClick={() => onPlay(generatedGame)} className="bg-white text-black px-8 py-3 rounded-xl font-black tracking-[0.1em] hover:scale-105 active:scale-95 transition-all shadow-xl uppercase italic text-xs">Probar Juego</button>
               </div>
            </div>

            <div className="bg-black/20 backdrop-blur-md rounded-[2rem] p-6 border border-white/5 space-y-4 shadow-xl">
              <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Herramientas</h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                {[
                  { id: 'box', label: 'Part', icon: '📦' },
                  { id: 'sphere', label: 'Sphere', icon: '⚽' },
                  { id: 'npc', label: 'Guest', icon: '👤' },
                  { id: 'lava', label: 'Lava', icon: '🔥' },
                  { id: 'water', label: 'Water', icon: '💧' },
                  { id: 'goal', label: 'Portal', icon: '🌀' },
                  { id: 'wedge', label: 'Wedge', icon: '📐' }
                ].map(tool => (
                  <button key={tool.id} onClick={() => addObject(tool.id)} className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-2xl border border-transparent hover:border-red-600 transition-all hover:bg-white/10 group shadow-lg">
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-black/60 border border-white/10 rounded-[2rem] p-6 space-y-6 shadow-xl">
              <h3 className="font-black text-white text-xs uppercase tracking-widest flex items-center space-x-2">
                <span className="text-red-600">●</span><span>PROPIEDADES</span>
              </h3>
              
              {selectedObject ? (
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[8px] font-black text-gray-500 uppercase mb-2 tracking-widest">Material</p>
                    <select value={selectedObject.material} onChange={e => updateObject(selectedObject.id, { material: e.target.value })} className="w-full bg-black text-white p-2 rounded-lg text-[9px] font-black uppercase outline-none border border-white/10">
                      <option value="plastic">Plastic</option>
                      <option value="neon">Neon</option>
                      <option value="wood">Wood</option>
                      <option value="grass">Grass</option>
                      <option value="glass">Glass</option>
                      <option value="slate">Slate</option>
                      <option value="forcefield">Forcefield</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {['X', 'Y', 'Z'].map(axis => (
                      <div key={axis} className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center mb-1 px-1">
                           <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Axis {axis}</label>
                           <span className="text-[8px] font-black text-red-500">{selectedObject.position[axis.toLowerCase() as keyof typeof selectedObject.position].toFixed(1)}</span>
                        </div>
                        <input type="range" min="-50" max="50" step="0.5" value={selectedObject.position[axis.toLowerCase() as keyof typeof selectedObject.position]} onChange={e => updateObject(selectedObject.id, { position: { [axis.toLowerCase()]: parseFloat(e.target.value) } })} className="w-full accent-red-600 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input type="color" value={selectedObject.color} onChange={e => updateObject(selectedObject.id, { color: e.target.value })} className="h-8 w-full bg-black border border-white/10 rounded-lg cursor-pointer" />
                    <button onClick={() => { if(selectedObjectId !== 'spawn') { setGeneratedGame({...generatedGame!, objects: generatedGame!.objects.filter(o => o.id !== selectedObjectId)}); setSelectedObjectId(null); } }} className="bg-red-600/10 text-red-600 px-3 rounded-lg text-[8px] font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-md">DEL</button>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center opacity-30">
                  <p className="text-[9px] font-black uppercase tracking-widest">Selecciona un objeto</p>
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 space-y-3 shadow-xl">
              <h3 className="text-[9px] font-black text-white uppercase tracking-widest">Explorer</h3>
              <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-hide">
                {generatedGame.objects.map(obj => (
                  <button 
                    key={obj.id} 
                    onClick={() => setSelectedObjectId(obj.id)}
                    className={`w-full text-left p-2 rounded-lg text-[9px] font-black uppercase transition-all ${selectedObjectId === obj.id ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                  >
                    {obj.type} <span className="opacity-40 text-[7px] ml-1">#{obj.id.slice(0,4)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Studio;
