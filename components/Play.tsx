
import React, { useEffect, useState, useRef } from 'react';
import { GameExperience, BloxObject, UserProfile, BloxMaterial } from '../types';
import { executeBloxScript } from '../services/geminiService';

const GRAVITY = -0.016;
const FRICTION = 0.82; 
const SCALE = 42; 
const CAMERA_SMOOTHING = 0.12;
const JUMP_FORCE = 0.45;

/**
 * COMPONENTE PRISMA 3D REAL (6 CARAS)
 */
const Real3DBlock: React.FC<{ 
  w: number, h: number, d: number, 
  color: string, 
  material?: BloxMaterial,
  style?: React.CSSProperties,
  isHead?: boolean
}> = ({ w, h, d, color, material, style, isHead }) => {
  const width = w * SCALE;
  const height = h * SCALE;
  const depth = d * SCALE;

  const faceStyle = (brightness: number): React.CSSProperties => ({
    position: 'absolute',
    backgroundColor: color,
    filter: `brightness(${brightness})`,
    border: '1px solid rgba(0,0,0,0.2)',
    backfaceVisibility: 'hidden',
    width: '100%',
    height: '100%',
    ...(material === 'neon' ? { boxShadow: `0 0 25px ${color}`, filter: 'brightness(1.5)' } : {})
  });

  return (
    <div style={{ position: 'absolute', width: width, height: depth, transformStyle: 'preserve-3d', ...style }}>
      {/* ARRIBA */}
      <div style={{ ...faceStyle(1.3), transform: `translateZ(${height}px)` }} />
      {/* FRENTE */}
      <div style={{ ...faceStyle(1.0), height: height, transform: `rotateX(-90deg)`, transformOrigin: 'top' }}>
        {isHead && (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 opacity-60">
            <div className="flex space-x-3">
              <div className="w-2 h-2 bg-black rounded-full" />
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            <div className="w-6 h-1.5 bg-black rounded-full" />
          </div>
        )}
      </div>
      {/* ATRÁS */}
      <div style={{ ...faceStyle(0.6), height: height, transform: `rotateX(-90deg) translateZ(${-depth}px)`, transformOrigin: 'top' }} />
      {/* IZQUIERDA */}
      <div style={{ ...faceStyle(0.8), width: depth, height: height, transform: `rotateY(-90deg) rotateX(-90deg)`, transformOrigin: 'top left' }} />
      {/* DERECHA */}
      <div style={{ ...faceStyle(0.8), width: depth, height: height, transform: `rotateY(90deg) rotateX(-90deg) translateZ(${width}px)`, transformOrigin: 'top left' }} />
      {/* ABAJO */}
      <div style={{ ...faceStyle(0.3), transform: `translateZ(0px)` }} />
    </div>
  );
};

const R6Avatar: React.FC<{ 
  user: UserProfile, 
  animTime: number, 
  velocity: { x: number, y: number, z: number },
  direction: number 
}> = ({ user, animTime, velocity, direction }) => {
  const horizontalSpeed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  const isMoving = horizontalSpeed > 0.05;
  const isJumping = Math.abs(velocity.z) > 0.05;
  
  // Frecuencia de animación basada en velocidad
  const walkFreq = horizontalSpeed * 40;
  const armAngle = isMoving ? Math.sin(animTime * walkFreq) * 35 : 0;
  const legAngle = isMoving ? Math.sin(animTime * walkFreq + Math.PI) * 35 : 0;
  const bodyBob = isMoving ? Math.abs(Math.sin(animTime * walkFreq * 2)) * 3 : 0;
  const jumpTilt = isJumping ? -velocity.z * 20 : 0;

  const skin = "#FFDBAC";
  const shirt = "#0074FF";
  const pants = "#FFFFFF";

  return (
    <div style={{ 
      transformStyle: 'preserve-3d', 
      position: 'relative',
      transform: `rotateZ(${-direction}deg) rotateX(${jumpTilt}deg) translateZ(${bodyBob}px)`,
      transition: 'transform 0.05s linear'
    }}>
      {/* SOMBRA */}
      <div style={{ 
        position: 'absolute', width: 1.2 * SCALE, height: 1.2 * SCALE, backgroundColor: 'rgba(0,0,0,0.3)', 
        borderRadius: '50%', transform: 'translate(-50%, -50%) translateZ(-2px)', filter: 'blur(6px)' 
      }} />

      {/* CABEZA */}
      <div style={{ transform: 'translate3d(0, 0, 2.5 * SCALE)', transformStyle: 'preserve-3d' }}>
        <Real3DBlock isHead={true} w={1} h={1} d={1} color={skin} style={{ transform: 'translate3d(-0.5 * SCALE, -0.5 * SCALE, 0)' }} />
        {/* Cabello Tocino (Varios bloques para volumen 3D) */}
        <div style={{ transformStyle: 'preserve-3d' }}>
           <Real3DBlock w={1.1} h={0.3} d={1.1} color="#3d2419" style={{ transform: 'translate3d(-0.55 * SCALE, -0.55 * SCALE, 0.9 * SCALE)' }} />
           <Real3DBlock w={0.3} h={1.2} d={1.1} color="#3d2419" style={{ transform: 'translate3d(-0.75 * SCALE, -0.55 * SCALE, 0.1 * SCALE)' }} />
           <Real3DBlock w={0.3} h={1.2} d={1.1} color="#3d2419" style={{ transform: 'translate3d(0.45 * SCALE, -0.55 * SCALE, 0.1 * SCALE)' }} />
        </div>
        {user.equippedItems.includes('item_crown') && (
          <Real3DBlock w={0.9} h={0.4} d={0.9} color="#FFD700" material="neon" style={{ transform: 'translate3d(-0.45 * SCALE, -0.45 * SCALE, 1.3 * SCALE)' }} />
        )}
      </div>

      {/* TORSO */}
      <div style={{ transform: 'translate3d(0, 0, 1.25 * SCALE)', transformStyle: 'preserve-3d' }}>
        <Real3DBlock w={1} h={1.25} d={1} color={shirt} style={{ transform: 'translate3d(-0.5 * SCALE, -0.5 * SCALE, 0)' }} />
      </div>

      {/* BRAZOS */}
      <div style={{ transform: `translate3d(-1.3 * SCALE, -0.5 * SCALE, 2.5 * SCALE) rotateX(${armAngle}deg)`, transformOrigin: 'top center', transformStyle: 'preserve-3d' }}>
        <Real3DBlock w={0.5} h={1.25} d={1} color={skin} style={{ transform: 'translate3d(0, 0, -1.25 * SCALE)' }} />
      </div>
      <div style={{ transform: `translate3d(0.8 * SCALE, -0.5 * SCALE, 2.5 * SCALE) rotateX(${-armAngle}deg)`, transformOrigin: 'top center', transformStyle: 'preserve-3d' }}>
        <Real3DBlock w={0.5} h={1.25} d={1} color={skin} style={{ transform: 'translate3d(0, 0, -1.25 * SCALE)' }} />
      </div>

      {/* PIERNAS */}
      <div style={{ transform: `translate3d(-0.9 * SCALE, -0.5 * SCALE, 1.25 * SCALE) rotateX(${legAngle}deg)`, transformOrigin: 'top center', transformStyle: 'preserve-3d' }}>
        <Real3DBlock w={0.8} h={1.25} d={1} color={pants} style={{ transform: 'translate3d(0, 0, -1.25 * SCALE)' }} />
      </div>
      <div style={{ transform: `translate3d(0.1 * SCALE, -0.5 * SCALE, 1.25 * SCALE) rotateX(${-legAngle}deg)`, transformOrigin: 'top center', transformStyle: 'preserve-3d' }}>
        <Real3DBlock w={0.8} h={1.25} d={1} color={pants} style={{ transform: 'translate3d(0, 0, -1.25 * SCALE)' }} />
      </div>
    </div>
  );
};

const Play: React.FC<{ game: GameExperience, user: UserProfile, onBack: () => void }> = ({ game, user, onBack }) => {
  const [objects, setObjects] = useState<BloxObject[]>(game.objects);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 2 });
  const [playerVel, setPlayerVel] = useState({ x: 0, y: 0, z: 0 });
  const [playerRotation, setPlayerRotation] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const [animTime, setAnimTime] = useState(0);
  const [chat, setChat] = useState(["Is Yoshi afk?", "No... air...", "yosher", "Wut?", "im going to pretend i dont care"]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => setKeys(p => ({ ...p, [e.key.toLowerCase()]: true }));
    const handleUp = (e: KeyboardEvent) => setKeys(p => ({ ...p, [e.key.toLowerCase()]: false }));
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    
    const update = () => {
      setAnimTime(t => t + 0.016);
      setPlayerPos(prev => {
        let dx = 0, dy = 0;
        const speed = keys['shift'] ? 0.4 : 0.22;

        if (keys['w']) dy += speed; if (keys['s']) dy -= speed;
        if (keys['a']) dx -= speed; if (keys['d']) dx += speed;

        if (dx !== 0 || dy !== 0) setPlayerRotation(Math.atan2(dx, dy) * (180 / Math.PI));

        let nx = prev.x + dx + playerVel.x;
        let ny = prev.y + dy + playerVel.y;
        let nz = prev.z + playerVel.z;
        let nvz = playerVel.z + GRAVITY;

        objects.forEach(obj => {
          const hSize = obj.size / 2;
          if (nx > obj.position.x - hSize && nx < obj.position.x + hSize && ny > obj.position.y - hSize && ny < obj.position.y + hSize) {
            const topZ = obj.position.z + 0.5;
            if (prev.z >= topZ - 0.2 && nz <= topZ) {
                nz = topZ; nvz = 0;
                if (keys[' ']) nvz = JUMP_FORCE;
            }
          }
        });

        if (nz < 0) { nz = 0; nvz = 0; if (keys[' ']) nvz = JUMP_FORCE; }
        setPlayerVel({ x: (playerVel.x + dx * 0.1) * FRICTION, y: (playerVel.y + dy * 0.1) * FRICTION, z: nvz });
        return { x: nx, y: ny, z: nz };
      });
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [keys, playerVel, objects]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden select-none">
      
      {/* MOTOR 3D ISO-CLASSIC */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ perspective: '3000px' }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30" />
        
        <div style={{ 
          transformStyle: 'preserve-3d', 
          transform: `rotateX(60deg) rotateZ(-30deg) translate3d(${-playerPos.x * SCALE}px, ${playerPos.y * SCALE}px, ${-playerPos.z * SCALE}px)`,
          transition: `transform ${CAMERA_SMOOTHING}s linear`
        }}>
          {/* Baseplate con "Studs" (Pernos) */}
          <div style={{ 
            position: 'absolute', width: '4000px', height: '4000px', 
            backgroundColor: '#666', transform: 'translate(-50%, -50%)', 
            backgroundImage: 'radial-gradient(#555 2px, transparent 0)', backgroundSize: '40px 40px',
            border: '2px solid #444'
          }} />
          
          {objects.map(obj => (
            <div key={obj.id} style={{ 
                position: 'absolute', left: obj.position.x * SCALE, top: -obj.position.y * SCALE, 
                width: obj.size * SCALE, height: obj.size * SCALE, backgroundColor: obj.color, 
                transform: `translate3d(-50%, -50%, ${obj.position.z * SCALE}px)`,
                border: '1px solid rgba(0,0,0,0.4)', borderRadius: '2px'
            }} />
          ))}

          {/* EL PLAYER R6 3D */}
          <div style={{ position: 'absolute', left: playerPos.x * SCALE, top: -playerPos.y * SCALE, transform: `translate3d(0, 0, ${playerPos.z * SCALE}px)`, transformStyle: 'preserve-3d' }}>
            <R6Avatar user={user} animTime={animTime} velocity={playerVel} direction={playerRotation} />
            <div className="absolute -top-36 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-sm border border-white/20">
               <span className="text-white font-bold text-[11px] whitespace-nowrap drop-shadow-md">{user.username}</span>
            </div>
          </div>
        </div>
      </div>

      {/* UI 2011 FIDELIDAD TOTAL */}
      <div className="absolute inset-0 flex flex-col pointer-events-none p-4">
        <div className="flex justify-between items-start">
           {/* CHAT CLÁSICO */}
           <div className="w-96 space-y-0.5 pointer-events-auto">
              {chat.map((m, i) => (
                <div key={i} className="bg-black/25 px-4 py-1.5 text-[12px] font-bold text-white border-l-4 border-blue-500/40">
                   <span className="text-blue-300 mr-2">Player:</span> {m}
                </div>
              ))}
              <input type="text" className="w-full bg-black/40 border border-white/10 text-white text-[12px] px-3 py-1.5 mt-2 focus:outline-none focus:border-blue-400" placeholder="Chat here..." />
           </div>

           {/* LEADERBOARD CLÁSICO */}
           <div className="w-52 bg-white/10 backdrop-blur-sm border border-white/20 p-3 pointer-events-auto">
              <div className="text-white text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-1.5 mb-2">Players</div>
              <div className="space-y-1">
                 <div className="flex justify-between text-blue-400 text-[12px] font-black">
                    <span>{user.username}</span>
                    <span>1,337</span>
                 </div>
                 <div className="flex justify-between text-yellow-500 text-[11px] font-bold">
                    <span>Builderman</span>
                    <span>0</span>
                 </div>
              </div>
           </div>
        </div>

        {/* HEALTH BAR 2011 */}
        <div className="mt-auto flex flex-col items-center pb-8">
           <div className="flex space-x-1 mb-6 pointer-events-auto">
              {[1,2,3,4,5,6,7,8,9,0].map(i => (
                <div key={i} className="w-12 h-12 bg-gray-800/80 border border-white/10 flex flex-col items-center justify-center relative hover:bg-gray-700 cursor-pointer shadow-xl">
                   <span className="text-white/20 text-[8px] absolute top-1 left-1">{i}</span>
                   {i === 1 && <span className="text-2xl">🗡️</span>}
                   {i === 2 && <span className="text-2xl">🔨</span>}
                </div>
              ))}
           </div>

           <div className="relative w-[34rem] h-9 bg-black/80 border-2 border-[#333] shadow-2xl pointer-events-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 border-r-4 border-green-200 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]" style={{ width: `${playerHealth}%` }} />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-white font-black text-[13px] uppercase tracking-[0.3em] drop-shadow-[1px_2px_0_rgba(0,0,0,0.8)]">HEALTH</span>
              </div>
           </div>
        </div>

        {/* BOTONES DE CONTROL */}
        <div className="absolute bottom-6 left-6 flex space-x-2 pointer-events-auto">
           <button onClick={onBack} className="bg-gray-900 border border-white/10 px-6 py-2 text-white text-[10px] font-black uppercase hover:bg-red-800 transition-colors">Leave Game</button>
           <button className="bg-gray-900 border border-white/10 px-6 py-2 text-white text-[10px] font-black uppercase hover:bg-gray-700 transition-colors">Reset Char</button>
        </div>
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/5 text-[10px] font-black tracking-[1em] uppercase">WWW.BLOX2011.COM</div>
      </div>
    </div>
  );
};

export default Play;
