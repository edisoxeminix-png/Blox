
import React, { useEffect, useState, useRef } from 'react';
import { GameExperience, BloxObject, UserProfile } from '../types';

const GRAVITY = -0.012;
const FRICTION = 0.82; 
const SCALE = 30;
const CAMERA_SMOOTHING = 0.1;

const BLOX_SCRIPTS = [
  { name: "Infinite Jump", description: "Salta sin límites", code: "-- Blox Script\n_G.InfJump = true\nprint('InfJump Loaded')" },
  { name: "Fly Mode V5", description: "Vuelo total", code: "fly()\nprint('Fly Mode Active')" },
  { name: "Noclip Pro", description: "Atraviesa todo", code: "noclip()\nprint('Noclip ON')" },
  { name: "Speed Hack", description: "Velocidad flash", code: "speed(0.35)\nprint('Speed: 35')" },
  { name: "Custom Spawner", description: "Spawn manual por script", code: "spawn_custom('sphere', '#FF00FF', 4)\nprint('Manual Spawn OK')" }
];

const Box3D: React.FC<{ 
  width: number, height: number, depth: number, 
  color: string, style?: React.CSSProperties, 
  className?: string, 
  innerRef?: React.RefObject<HTMLDivElement | null> 
}> = ({ width, height, depth, color, style, className, innerRef }) => {
  return (
    <div 
      ref={innerRef}
      className={className}
      style={{
        position: 'absolute',
        width: `${width}px`,
        height: `${height}px`,
        transformStyle: 'preserve-3d',
        ...style
      }}
    >
      {/* Front */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: color, transform: `translateZ(${depth / 2}px)`, border: '1px solid rgba(0,0,0,0.1)' }} />
      {/* Back */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: color, transform: `rotateY(180deg) translateZ(${depth / 2}px)`, filter: 'brightness(0.7)' }} />
      {/* Top */}
      <div style={{ position: 'absolute', width: `${width}px`, height: `${depth}px`, background: color, transform: `rotateX(90deg) translateZ(${depth / 2}px)`, top: `-${depth/2}px`, filter: 'brightness(1.1)' }} />
      {/* Bottom */}
      <div style={{ position: 'absolute', width: `${width}px`, height: `${depth}px`, background: color, transform: `rotateX(-90deg) translateZ(${height - depth/2}px)`, top: `-${depth/2}px`, filter: 'brightness(0.5)' }} />
      {/* Right */}
      <div style={{ position: 'absolute', width: `${depth}px`, height: '100%', background: color, transform: `rotateY(90deg) translateZ(${width - depth/2}px)`, left: `-${depth/2}px`, filter: 'brightness(0.85)' }} />
      {/* Left */}
      <div style={{ position: 'absolute', width: `${depth}px`, height: '100%', background: color, transform: `rotateY(-90deg) translateZ(${depth / 2}px)`, left: `-${depth/2}px`, filter: 'brightness(0.85)' }} />
    </div>
  );
};

const CharacterView: React.FC<{ 
  name: string, color: string, walking?: boolean, chat?: string, isDead?: boolean,
  charConfig?: { headSize: number, bodyWidth: number }
}> = ({ name, color, walking, chat, isDead, charConfig = { headSize: 1.2, bodyWidth: 1.0 } }) => {
  const leftLeg = useRef<HTMLDivElement>(null);
  const rightLeg = useRef<HTMLDivElement>(null);
  const leftArm = useRef<HTMLDivElement>(null);
  const rightArm = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let frame: number;
    const animate = () => {
      const time = Date.now() * 0.012;
      const angle = walking && !isDead ? Math.sin(time) * 35 : 0;
      if (leftLeg.current) leftLeg.current.style.transform = `rotateX(${angle}deg)`;
      if (rightLeg.current) rightLeg.current.style.transform = `rotateX(${-angle}deg)`;
      if (leftArm.current) leftArm.current.style.transform = `rotateX(${-angle}deg)`;
      if (rightArm.current) rightArm.current.style.transform = `rotateX(${angle}deg)`;
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [walking, isDead]);

  if (isDead) return null;

  return (
    <div style={{ position: 'absolute', left: '50%', top: '50%', transformStyle: 'preserve-3d', zIndex: 10 }}>
      {chat && <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded border border-gray-400 text-[10px] font-bold text-black shadow-md z-[200] whitespace-nowrap">{chat}</div>}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm whitespace-nowrap z-[150]">{name}</div>
      
      {/* Torso */}
      <Box3D width={20 * charConfig.bodyWidth} height={28} depth={12} color={color} style={{ left: '-10px', top: '-14px' }} />
      
      {/* Head */}
      <Box3D width={14 * charConfig.headSize} height={14 * charConfig.headSize} depth={14 * charConfig.headSize} color="#f0d0b0" style={{ left: `${-7 * charConfig.headSize}px`, top: `${-14 - (14 * charConfig.headSize)}px` }} />
      
      {/* Left Arm */}
      <Box3D innerRef={leftArm} width={8} height={24} depth={8} color={color} style={{ left: '-19px', top: '-14px', transformOrigin: 'top center' }} />
      
      {/* Right Arm */}
      <Box3D innerRef={rightArm} width={8} height={24} depth={8} color={color} style={{ left: '11px', top: '-14px', transformOrigin: 'top center' }} />
      
      {/* Left Leg */}
      <Box3D innerRef={leftLeg} width={9} height={24} depth={10} color="#333" style={{ left: '-10px', top: '14px', transformOrigin: 'top center' }} />
      
      {/* Right Leg */}
      <Box3D innerRef={rightLeg} width={9} height={24} depth={10} color="#333" style={{ left: '1px', top: '14px', transformOrigin: 'top center' }} />
    </div>
  );
};

const Play: React.FC<{ game: GameExperience; onBack: () => void; user: UserProfile }> = ({ game, onBack, user }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [localWorld, setLocalWorld] = useState<BloxObject[]>(game.objects);
  const spawnObj = localWorld.find(o => o.id === 'spawn') || { position: { x: 0, y: 0, z: 0 }, size: 4 };
  
  const pos = useRef({ x: spawnObj.position.x, y: spawnObj.position.y, z: spawnObj.position.z + 5 });
  const vel = useRef({ x: 0, y: 0, z: 0 });
  const camPos = useRef({ x: spawnObj.position.x, y: spawnObj.position.y, z: spawnObj.position.z });
  const onGround = useRef(true);
  const keys = useRef<{ [key: string]: boolean }>({});
  
  const [health, setHealth] = useState(100);
  const [isWinning, setIsWinning] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [localChat, setLocalChat] = useState<{msg: string, time: number} | null>(null);

  // HACKS & UI
  const [isFlyMode, setIsFlyMode] = useState(false);
  const [isNoclip, setIsNoclip] = useState(false);
  const [isInfJump, setIsInfJump] = useState(false);
  const [customSpeed, setCustomSpeed] = useState(0.06);
  const [customJump, setCustomJump] = useState(0.42);
  const [showExecutor, setShowExecutor] = useState(false);
  const [execTab, setExecTab] = useState<'editor' | 'hub' | 'spawner'>('editor');
  const [scriptContent, setScriptContent] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showHub, setShowHub] = useState(false);

  // MANUAL SPAWNER STATE
  const [spawnType, setSpawnType] = useState<'box' | 'sphere' | 'npc' | 'goal' | 'lava'>('box');
  const [spawnColor, setSpawnColor] = useState('#FF0000');
  const [spawnSize, setSpawnSize] = useState(2);

  // AUDIO
  const audioCtx = useRef<AudioContext | null>(null);
  const playSound = (type: 'jump' | 'land' | 'win' | 'death') => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (type === 'jump') { osc.frequency.setValueAtTime(300, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime+0.1); gain.gain.setValueAtTime(0.1, ctx.currentTime); osc.start(); osc.stop(ctx.currentTime+0.1); }
    if (type === 'land') { osc.frequency.setValueAtTime(100, ctx.currentTime); gain.gain.setValueAtTime(0.05, ctx.currentTime); osc.start(); osc.stop(ctx.currentTime+0.05); }
    if (type === 'death') { osc.type='sawtooth'; osc.frequency.setValueAtTime(200, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime+0.3); gain.gain.setValueAtTime(0.2, ctx.currentTime); osc.start(); osc.stop(ctx.currentTime+0.3); }
    if (type === 'win') { osc.frequency.setValueAtTime(500, ctx.currentTime); osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime+0.5); gain.gain.setValueAtTime(0.1, ctx.currentTime); osc.start(); osc.stop(ctx.currentTime+0.5); }
  };

  const [joystick, setJoystick] = useState<{ active: boolean, startX: number, startY: number, x: number, y: number } | null>(null);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; if (e.key.toLowerCase() === 'k' && user.hasExecutor) setShowExecutor(v => !v); };
    const handleUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleDown); window.addEventListener('keyup', handleUp);
    return () => { window.removeEventListener('keydown', handleDown); window.removeEventListener('keyup', handleUp); };
  }, [user.hasExecutor]);

  const addLog = (msg: string, isError = false) => setConsoleLogs(prev => [...prev.slice(-10), `${isError ? '❌' : '✅'} [${new Date().toLocaleTimeString()}] ${msg}`]);

  const executeManualSpawn = () => {
    const newP: BloxObject = { 
      id: 'm-' + Math.random(), 
      type: spawnType, 
      position: { x: pos.current.x, y: pos.current.y, z: pos.current.z }, 
      color: spawnColor, 
      size: spawnSize 
    };
    setLocalWorld(prev => [...prev, newP]);
    addLog(`Spawned ${spawnType} at Player`);
  };

  const executeScript = async (codeToRun?: string) => {
    const code = (codeToRun || scriptContent).trim();
    if (!code) return;
    const isBlox = code.toLowerCase().includes('blox') || code.toLowerCase().includes('game:') || code.toLowerCase().includes('fly()') || code.toLowerCase().includes('noclip()') || code.toLowerCase().includes('speed(') || code.toLowerCase().includes('spawn_') || code.toLowerCase().includes('loader');
    if (!isBlox) { addLog("¡ESTE SCRIPT NO ES PARA BLOX!", true); return; }
    addLog("Injecting...");
    
    if (code.includes('spawn_custom(')) {
      const match = code.match(/spawn_custom\('([^']+)',\s*'([^']+)',\s*([\d\.]+)\)/);
      if (match) {
        const newP: BloxObject = { id: 's-'+Math.random(), type: match[1] as any, position: { x: pos.current.x, y: pos.current.y, z: pos.current.z }, color: match[2], size: parseFloat(match[3]) };
        setLocalWorld(prev => [...prev, newP]);
        addLog("Script Spawner OK");
      }
    } else if (code.includes('fly()')) { setIsFlyMode(!isFlyMode); addLog(`Fly: ${!isFlyMode}`); }
    else if (code.includes('noclip()')) { setIsNoclip(!isNoclip); addLog(`Noclip: ${!isNoclip}`); }
    else if (code.includes('_G.InfJump = true')) { setIsInfJump(true); addLog("InfJump Enabled"); }
    else if (code.includes('speed(')) { const m = code.match(/speed\(([\d\.]+)\)/); if(m) { setCustomSpeed(parseFloat(m[1])); addLog("Speed Set"); } }
    else { addLog("Script Executed"); }
  };

  useEffect(() => {
    let frameId: number; let lastG = true;
    const runLoop = () => {
      if (isWinning) return;
      if (health <= 0 || pos.current.z < -25) { playSound('death'); setHealth(100); pos.current = { x: spawnObj.position.x, y: spawnObj.position.y, z: spawnObj.position.z + 5 }; vel.current = { x: 0, y: 0, z: 0 }; setLocalChat({ msg: "OOF!", time: Date.now() }); }
      const movePower = isFlyMode ? 0.4 : (onGround.current ? customSpeed : customSpeed * 0.8);
      let move = false;
      if (keys.current['w']) { vel.current.y += movePower; move = true; } if (keys.current['s']) { vel.current.y -= movePower; move = true; }
      if (keys.current['a']) { vel.current.x -= movePower; move = true; } if (keys.current['d']) { vel.current.x += movePower; move = true; }
      if (isFlyMode) { vel.current.z = 0; if (keys.current[' ']) pos.current.z += 0.4; if (keys.current['shift']) pos.current.z -= 0.4; }
      else { if (keys.current[' '] && (onGround.current || isInfJump)) { vel.current.z = customJump; onGround.current = false; playSound('jump'); } vel.current.z += GRAVITY; }
      setIsWalking(move); vel.current.x *= FRICTION; vel.current.y *= FRICTION;
      pos.current.x += vel.current.x; pos.current.y += vel.current.y; pos.current.z += vel.current.z;
      let foundG = false;
      if (!isNoclip) {
        localWorld.forEach(obj => {
          const dx = pos.current.x - obj.position.x; const dy = pos.current.y - obj.position.y; const half = obj.size / 2;
          if (Math.abs(dx) < half + 0.45 && Math.abs(dy) < half + 0.45) {
            const top = obj.position.z + half;
            if (pos.current.z >= top - 0.5 && pos.current.z <= top + 0.8 && vel.current.z <= 0) {
              if (!isFlyMode) { pos.current.z = top; vel.current.z = 0; onGround.current = true; }
              foundG = true; if (obj.type === 'goal') { setIsWinning(true); playSound('win'); }
              if (obj.type === 'lava') setHealth(h => Math.max(0, h - 2));
            }
          }
        });
      }
      if (!foundG) onGround.current = false; if (onGround.current && !lastG) playSound('land'); lastG = onGround.current;
      camPos.current.x += (pos.current.x - camPos.current.x) * CAMERA_SMOOTHING; camPos.current.y += (pos.current.y - camPos.current.y) * CAMERA_SMOOTHING; camPos.current.z += (pos.current.z - camPos.current.z) * CAMERA_SMOOTHING;
      if (sceneRef.current) sceneRef.current.style.transform = `rotateX(55deg) rotateZ(-25deg) translate3d(${-camPos.current.x * SCALE}px, ${camPos.current.y * SCALE}px, ${-camPos.current.z * SCALE}px)`;
      if (playerRef.current) playerRef.current.style.transform = `translate3d(-50%, -50%, 0) translate3d(${pos.current.x * SCALE}px, ${-pos.current.y * SCALE}px, ${pos.current.z * SCALE}px)`;
      frameId = requestAnimationFrame(runLoop);
    };
    runLoop(); return () => cancelAnimationFrame(frameId);
  }, [localWorld, isFlyMode, isNoclip, isInfJump, customSpeed, customJump, isWinning]);

  return (
    <div className="fixed inset-0 bg-[#87CEEB] z-[200] overflow-hidden touch-none flex flex-col font-sans"
      onTouchStart={e => { const t = e.touches[0]; if (t.clientX < window.innerWidth / 2) setJoystick({ active: true, startX: t.clientX, startY: t.clientY, x: t.clientX, y: t.clientY }); }}
      onTouchMove={e => { if (!joystick) return; const t = e.touches[0]; const dx = t.clientX - joystick.startX; const dy = t.clientY - joystick.startY; keys.current['w'] = dy < -20; keys.current['s'] = dy > 20; keys.current['a'] = dx < -20; keys.current['d'] = dx > 20; setJoystick({ ...joystick, x: t.clientX, y: t.clientY }); }}
      onTouchEnd={() => { setJoystick(null); keys.current['w'] = keys.current['s'] = keys.current['a'] = keys.current['d'] = false; }}
    >
      <div className="h-9 bg-[#1a1a1a] flex items-center justify-between px-3 text-white text-[10px] font-bold z-[300] border-b-2 border-red-600">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="bg-red-700 px-3 py-1 rounded shadow uppercase">Salir</button>
          <span>{game.title}</span>
        </div>
        <div className="bg-gray-800 h-4 w-32 rounded relative border border-gray-600 overflow-hidden shadow-inner">
          <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${health}%` }} />
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-white">{health}% HP</span>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center" style={{ perspective: '1000px' }}>
        <div ref={sceneRef} className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
           {localWorld.map(obj => (
             <Box3D 
               key={obj.id} 
               width={obj.size * SCALE} 
               height={obj.size * SCALE} 
               depth={obj.size * SCALE} 
               color={obj.color} 
               style={{ 
                 left: `calc(50% + ${obj.position.x * SCALE}px)`, 
                 top: `calc(50% - ${obj.position.y * SCALE}px)`,
                 transform: `translate(-50%, -50%) translateZ(${obj.position.z * SCALE}px)`,
                 opacity: isNoclip ? 0.6 : 1,
                 pointerEvents: isNoclip ? 'none' : 'auto'
               }} 
             />
           ))}
           <div ref={playerRef} style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
             <CharacterView name={user.username} color={user.avatarColor} walking={isWalking} chat={localChat && (Date.now() - localChat.time < 5000) ? localChat.msg : ''} />
           </div>
        </div>

        <div className="absolute bottom-8 right-8 flex flex-col space-y-4 items-center z-[1000] pointer-events-auto">
          {user.hasExecutor && (
            <button onPointerDown={() => setShowExecutor(!showExecutor)} className="w-18 h-18 bg-red-600 rounded-full border-4 border-red-400 text-white font-black text-4xl shadow-lg animate-pulse">K</button>
          )}
          <button onPointerDown={() => keys.current[' '] = true} onPointerUp={() => keys.current[' '] = false} className="w-24 h-24 bg-white/10 border-4 border-white/30 rounded-full flex flex-col items-center justify-center text-white font-black backdrop-blur-xl">
            <span className="text-4xl">↑</span><span className="text-[10px] uppercase tracking-tighter">Jump</span>
          </button>
        </div>

        {showExecutor && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-[#222] border-2 border-[#444] shadow-2xl z-[5000] flex flex-col font-mono overflow-hidden rounded-lg">
            <div className="bg-[#111] p-3 flex justify-between text-white text-[11px] font-bold border-b-2 border-red-600">
              <span>☣️ KRNL BLOXHAZ EXECUTOR v5.1</span>
              <button onClick={() => setShowExecutor(false)} className="text-2xl hover:text-red-500">×</button>
            </div>
            <div className="bg-[#333] flex text-[10px]">
               <button onClick={() => setExecTab('editor')} className={`flex-1 py-2 font-black ${execTab === 'editor' ? 'bg-[#1e1e1e] text-green-500' : 'text-gray-400'}`}>EDITOR</button>
               <button onClick={() => setExecTab('hub')} className={`flex-1 py-2 font-black ${execTab === 'hub' ? 'bg-[#1e1e1e] text-red-500' : 'text-gray-400'}`}>SCRIPT HUB</button>
               <button onClick={() => setExecTab('spawner')} className={`flex-1 py-2 font-black ${execTab === 'spawner' ? 'bg-[#1e1e1e] text-blue-500' : 'text-gray-400'}`}>SPAWNER</button>
            </div>
            
            {execTab === 'editor' && (
              <div className="flex flex-col">
                <textarea value={scriptContent} onChange={e => setScriptContent(e.target.value)} className="h-44 bg-[#111] text-green-400 p-3 text-xs focus:outline-none resize-none" placeholder="-- BloxHaz Injector..." />
                <div className="h-24 bg-black p-2 overflow-y-auto text-[9px] text-blue-400 border-t border-[#333]">{consoleLogs.map((log, i) => <div key={i}>{log}</div>)}</div>
                <div className="p-3 bg-[#2a2a2a] flex gap-2">
                  <button onClick={() => executeScript()} className="flex-1 bg-red-600 text-white py-3 text-[11px] font-black uppercase">Execute</button>
                  <button onClick={() => { setScriptContent(''); setConsoleLogs([]); }} className="bg-[#444] text-white px-6 text-[10px] font-black uppercase tracking-tighter">Clear</button>
                </div>
              </div>
            )}

            {execTab === 'hub' && (
              <div className="h-[310px] bg-[#111] overflow-y-auto p-4 space-y-3">
                 {BLOX_SCRIPTS.map((s, idx) => (
                   <div key={idx} className="bg-[#1e1e1e] p-4 border border-[#333] rounded-lg flex justify-between items-center group hover:border-red-600 transition-colors">
                      <div><p className="text-white text-[11px] font-black mb-1">{s.name}</p><p className="text-[9px] text-gray-500 leading-tight">{s.description}</p></div>
                      <button onClick={() => executeScript(s.code)} className="bg-red-600 text-white text-[10px] px-4 py-2 font-black rounded hover:bg-red-500 transition-colors">INJECT</button>
                   </div>
                 ))}
              </div>
            )}

            {execTab === 'spawner' && (
              <div className="h-[310px] bg-[#1e1e1e] p-6 space-y-4">
                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Manual Object Spawner</p>
                 <div className="space-y-3">
                   <div>
                     <label className="text-[9px] text-gray-400 uppercase font-black block mb-1">Type</label>
                     <select value={spawnType} onChange={e => setSpawnType(e.target.value as any)} className="w-full bg-[#111] text-white border border-[#333] p-2 text-xs rounded outline-none">
                       <option value="box">Cubo (Part)</option>
                       <option value="sphere">Esfera (Sphere)</option>
                       <option value="npc">Guest (NPC)</option>
                       <option value="lava">Lava Block</option>
                       <option value="goal">Meta (Goal)</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-[9px] text-gray-400 uppercase font-black block mb-1">Color (Hex)</label>
                     <div className="flex space-x-2">
                       <input type="color" value={spawnColor} onChange={e => setSpawnColor(e.target.value)} className="w-10 h-10 bg-[#111] border border-[#333] rounded p-1" />
                       <input type="text" value={spawnColor} onChange={e => setSpawnColor(e.target.value)} className="flex-1 bg-[#111] text-white border border-[#333] p-2 text-xs font-mono rounded" />
                     </div>
                   </div>
                   <div>
                     <label className="text-[9px] text-gray-400 uppercase font-black block mb-1">Size: {spawnSize}</label>
                     <input type="range" min="0.5" max="10" step="0.5" value={spawnSize} onChange={e => setSpawnSize(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                   </div>
                   <button onClick={executeManualSpawn} className="w-full bg-blue-600 text-white py-4 rounded font-black uppercase text-xs shadow-lg hover:bg-blue-500 transition-all">Spawn Item</button>
                 </div>
              </div>
            )}
          </div>
        )}

        {showHub && (
          <div className="absolute top-12 left-6 w-52 bg-[#111] border-2 border-red-600 rounded-xl shadow-2xl z-[6000] flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-left">
            <div className="bg-red-600 p-2 text-white text-[10px] font-black text-center uppercase flex justify-between px-3"><span>BLOXHAZ HUB v4.2</span><button onClick={() => setShowHub(false)}>×</button></div>
            <div className="p-4 space-y-3 bg-[#1a1a1a]">
               <button onClick={() => { setIsFlyMode(!isFlyMode); playSound('jump'); }} className={`w-full py-2 text-[10px] font-black rounded border ${isFlyMode ? 'bg-red-600 text-white' : 'bg-[#222] text-gray-500'}`}>FLY: {isFlyMode ? 'ON' : 'OFF'}</button>
               <button onClick={() => { setIsNoclip(!isNoclip); playSound('jump'); }} className={`w-full py-2 text-[10px] font-black rounded border ${isNoclip ? 'bg-red-600 text-white' : 'bg-[#222] text-gray-500'}`}>NOCLIP: {isNoclip ? 'ON' : 'OFF'}</button>
               <button onClick={() => { setIsInfJump(!isInfJump); playSound('jump'); }} className={`w-full py-2 text-[10px] font-black rounded border ${isInfJump ? 'bg-red-600 text-white' : 'bg-[#222] text-gray-500'}`}>INF JUMP: {isInfJump ? 'ON' : 'OFF'}</button>
               <div className="pt-2 border-t border-[#333]"><div className="flex justify-between text-[8px] text-gray-400 font-black"><span>SPEED</span><span>{Math.round(customSpeed * 1000)}</span></div><input type="range" min="0.04" max="0.5" step="0.02" value={customSpeed} onChange={e => setCustomSpeed(parseFloat(e.target.value))} className="w-full accent-red-600 h-1 bg-[#333] rounded-lg appearance-none cursor-pointer" /></div>
            </div>
          </div>
        )}
      </div>

      {isWinning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[40px] text-center shadow-2xl animate-in zoom-in-50 duration-500 max-w-sm">
            <div className="text-7xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-black italic text-blue-600 mb-2 uppercase">¡Ganaste!</h2>
            <p className="text-gray-500 font-bold mb-6 italic">Has dominado el mundo.</p>
            <button onClick={onBack} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-lg shadow-xl active:scale-95 transition-all">Continuar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
