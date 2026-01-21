
import React, { useState } from 'react';
import { generateGameThumbnail } from '../services/geminiService';
import { GameExperience, BloxObject, UserProfile } from '../types';

interface StudioProps {
  onPlay: (game: GameExperience) => void;
  user: UserProfile;
}

const Studio: React.FC<StudioProps> = ({ onPlay, user }) => {
  const [gameTitle, setGameTitle] = useState('');
  const [gameDesc, setGameDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<GameExperience | null>(null);
  const [status, setStatus] = useState('');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  const handleCreateNewGame = async () => {
    if (!gameTitle.trim()) return;
    setIsGenerating(true);
    setStatus('Gemini está diseñando tu portada...');
    try {
      const thumbnail = await generateGameThumbnail(gameTitle);
      
      const newGame: GameExperience = {
        id: Math.random().toString(36).substr(2, 9),
        title: gameTitle,
        description: gameDesc || 'Una nueva experiencia creada en Blox Studio',
        creator: user.username,
        thumbnail: thumbnail,
        objects: [
          { id: 'spawn', type: 'box', position: { x: 0, y: 0, z: 0 }, color: '#888888', size: 4 }
        ],
        instructions: '¡Explora esta creación!'
      };
      
      setGeneratedGame(newGame);
      setSelectedObjectId('spawn');
    } catch (error) {
      console.error(error);
      alert('Error al crear el proyecto.');
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  const addObject = (type: 'box' | 'sphere' | 'npc' | 'goal' | 'lava') => {
    if (!generatedGame) return;
    const newId = 'obj-' + Math.random().toString(36).substr(2, 5);
    const newObj: BloxObject = {
      id: newId,
      type: type,
      position: { x: 5, y: 0, z: 2 },
      color: type === 'lava' ? '#FF4500' : type === 'goal' ? '#FFD700' : '#3388FF',
      size: type === 'npc' ? 1.5 : 2
    };
    
    setGeneratedGame({
      ...generatedGame,
      objects: [...generatedGame.objects, newObj]
    });
    setSelectedObjectId(newId);
  };

  const updateObject = (id: string, updates: any) => {
    if (!generatedGame) return;
    setGeneratedGame({
      ...generatedGame,
      objects: generatedGame.objects.map(obj => {
        if (obj.id === id) {
          const newObj = { ...obj };
          if (updates.position) newObj.position = { ...newObj.position, ...updates.position };
          if (updates.color) newObj.color = updates.color;
          if (updates.size) newObj.size = updates.size;
          return newObj;
        }
        return obj;
      })
    });
  };

  const selectedObject = generatedGame?.objects.find(o => o.id === selectedObjectId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">🛠️</div>
          <div>
            <h2 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">Blox Studio</h2>
            <p className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Editor de Mundos Manual</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {!generatedGame ? (
            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-2xl font-black uppercase italic text-blue-600">Nuevo Proyecto</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Nombre del Juego</label>
                  <input
                    type="text"
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                    placeholder="Ej: Súper Parkour 2011"
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none text-lg font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Descripción</label>
                  <textarea
                    value={gameDesc}
                    onChange={(e) => setGameDesc(e.target.value)}
                    placeholder="Cuéntale a otros de qué trata tu juego..."
                    className="w-full h-24 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none text-sm font-bold transition-all resize-none"
                  />
                </div>
              </div>
              <button
                onClick={handleCreateNewGame}
                disabled={isGenerating || !gameTitle.trim()}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg hover:shadow-blue-200 transition-all disabled:bg-gray-200 uppercase tracking-widest"
              >
                {isGenerating ? status : "🚀 Empezar a Construir"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                <div className="grid md:grid-cols-5">
                  <div className="md:col-span-2 relative">
                    <img src={generatedGame.thumbnail} className="w-full h-full object-cover min-h-[250px]" alt="Preview" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                       <span className="text-white font-black uppercase text-xs">Portada generada por Gemini</span>
                    </div>
                  </div>
                  <div className="md:col-span-3 p-8 flex flex-col justify-center">
                    <h3 className="text-3xl font-black mb-1 tracking-tighter">{generatedGame.title}</h3>
                    <p className="text-gray-400 font-bold mb-6 text-xs uppercase tracking-widest">Creado por {generatedGame.creator}</p>
                    <div className="flex space-x-2">
                       <button onClick={() => onPlay(generatedGame)} className="flex-1 bg-green-500 text-white font-black py-4 rounded-xl hover:bg-green-600 shadow-md transition-all hover:-translate-y-1 uppercase italic">¡Probar Juego!</button>
                       <button onClick={() => setGeneratedGame(null)} className="bg-gray-100 text-gray-500 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all uppercase font-black text-xs">Cerrar</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toolbox */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Herramientas (Toolbox)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[
                    { type: 'box', label: 'Cubo', icon: '📦' },
                    { type: 'sphere', label: 'Esfera', icon: '⚽' },
                    { type: 'npc', label: 'Guest', icon: '👤' },
                    { type: 'lava', label: 'Lava', icon: '🔥' },
                    { type: 'goal', label: 'Meta', icon: '🏆' }
                  ].map((tool) => (
                    <button
                      key={tool.type}
                      onClick={() => addObject(tool.type as any)}
                      className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-blue-500 hover:bg-white transition-all group"
                    >
                      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{tool.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{tool.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 h-full flex flex-col">
            <h3 className="font-black text-lg mb-4 flex items-center space-x-2 uppercase">
              <span className="text-blue-600">🌎</span><span>Explorador</span>
            </h3>
            
            {generatedGame ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                  {generatedGame.objects.map(obj => (
                    <button
                      key={obj.id}
                      onClick={() => setSelectedObjectId(obj.id)}
                      className={`w-full text-left p-3 rounded-xl text-[10px] font-black flex items-center justify-between transition-all border-2 ${
                        selectedObjectId === obj.id ? 'bg-blue-600 border-blue-400 text-white shadow-md' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <span className="uppercase">{obj.type} {obj.id === 'spawn' && '(Base)'}</span>
                      <div className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: obj.color }} />
                    </button>
                  ))}
                </div>

                {selectedObject && (
                  <div className="pt-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-bottom-2">
                    <div className="space-y-3">
                       <div>
                         <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase">Posición X</label>
                            <span className="text-[9px] font-bold text-blue-600">{selectedObject.position.x.toFixed(1)}</span>
                         </div>
                         <input type="range" min="-40" max="60" step="0.5" value={selectedObject.position.x} onChange={e => updateObject(selectedObject.id, { position: { x: parseFloat(e.target.value) } })} className="w-full accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
                       </div>
                       <div>
                         <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase">Posición Y</label>
                            <span className="text-[9px] font-bold text-blue-600">{selectedObject.position.y.toFixed(1)}</span>
                         </div>
                         <input type="range" min="-40" max="40" step="0.5" value={selectedObject.position.y} onChange={e => updateObject(selectedObject.id, { position: { y: parseFloat(e.target.value) } })} className="w-full accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
                       </div>
                       <div>
                         <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase">Posición Z</label>
                            <span className="text-[9px] font-bold text-blue-600">{selectedObject.position.z.toFixed(1)}</span>
                         </div>
                         <input type="range" min="-5" max="40" step="0.5" value={selectedObject.position.z} onChange={e => updateObject(selectedObject.id, { position: { z: parseFloat(e.target.value) } })} className="w-full accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
                       </div>
                       <div>
                         <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase">Tamaño</label>
                            <span className="text-[9px] font-bold text-blue-600">{selectedObject.size.toFixed(1)}</span>
                         </div>
                         <input type="range" min="0.5" max="15" step="0.5" value={selectedObject.size} onChange={e => updateObject(selectedObject.id, { size: parseFloat(e.target.value) })} className="w-full accent-blue-600 h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer" />
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#FFFFFF', '#000000', '#FFA500', '#888888'].map(c => (
                        <button key={c} onClick={() => updateObject(selectedObject.id, { color: c })} className={`w-6 h-6 rounded-lg border-2 transition-transform hover:scale-110 ${selectedObject.color === c ? 'border-blue-500 scale-110 shadow-md' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        if (selectedObjectId === 'spawn') return alert('No puedes borrar el punto de inicio.');
                        setGeneratedGame({ ...generatedGame, objects: generatedGame.objects.filter(o => o.id !== selectedObjectId) });
                        setSelectedObjectId(null);
                      }}
                      className="w-full py-2 bg-red-50 text-red-600 font-black rounded-xl text-[9px] uppercase hover:bg-red-100 transition-colors"
                    >
                      Borrar Bloque
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                <div className="text-4xl mb-2">🧱</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Crea un proyecto para empezar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
