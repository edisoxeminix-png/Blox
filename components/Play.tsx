
import React, { useEffect, useState, useRef } from 'react';
import { GameExperience, BloxObject, UserProfile } from '../types';
import { getBotResponse } from '../services/geminiService';

const GRAVITY = -0.012;
const JUMP_FORCE = 0.42; 
const ACCEL = 0.05; 
const MAX_SPEED = 0.35;
const FRICTION = 0.82; 
const SCALE = 30;

interface RemotePlayer {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  isBot: boolean;
  targetX: number;
  targetY: number;
  lastChat: string;
  chatTime: number;
  isJumping: boolean;
  isDead: boolean;
  respawnTime: number;
}

const Voxel: React.FC<{ obj: BloxObject }> = ({ obj }) => {
  const s = obj.size * SCALE;
  const isLava = obj.type === 'lava';
  return (
    <div 
      style={{
        position: 'absolute',
        left: `calc(50% + ${obj.position.x * SCALE}px)`,
        top: `calc(50% - ${obj.position.y * SCALE}px)`,
        width: `${s}px`,
        height: `${s}px`,
        transform: `translate(-50%, -50%) translateZ(${obj.position.z * SCALE}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: obj.color, 
        border: '1px solid rgba(0,0,0,0.1)', 
        transform: `translateZ(${s/2}px)`,
        opacity: isLava ? 0.9 : 1,
        boxShadow: isLava ? '0 0 30px #FF4500' : 'none'
      }} />
      <div style={{ position: 'absolute', inset: 0, background: obj.color, filter: 'brightness(0.7)', transform: `rotateX(90deg) translateZ(${s/2}px)` }} />
      <div style={{ position: 'absolute', inset: 0, background: obj.color, filter: 'brightness(0.7)', transform: `rotateX(-90deg) translateZ(${s/2}px)` }} />
      <div style={{ position: 'absolute', inset: 0, background: obj.color, filter: 'brightness(0.85)', transform: `rotateY(90deg) translateZ(${s/2}px)` }} />
      <div style={{ position: 'absolute', inset: 0, background: obj.color, filter: 'brightness(0.85)', transform: `rotateY(-90deg) translateZ(${s/2}px)` }} />
    </div>
  );
};

const Hand: React.FC<{ side: 'left' | 'right', color: string, mousePos?: { x: number, y: number } }> = ({ side, color, mousePos }) => {
  const handRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let frame: number;
    const animate = () => {
      const time = Date.now() * 0.005;
      if (handRef.current) {
        let tx = side === 'left' ? -25 : 25;
        let ty = 5;
        let tz = 15 + Math.sin(time + (side === 'left' ? 0 : Math.PI)) * 5;

        if (mousePos) {
          // Si es el jugador local, las manos apuntan ligeramente hacia el ratón
          const offset = side === 'left' ? -30 : 30;
          tx = offset + (mousePos.x * 40);
          ty = (mousePos.y * 40);
          tz = 20 + Math.sin(time) * 3;
        }

        handRef.current.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${Math.sin(time)*10}deg)`;
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [side, mousePos]);

  return (
    <div 
      ref={handRef}
      className="absolute w-4 h-4 rounded-sm border border-black/20 shadow-lg"
      style={{ 
        backgroundColor: color,
        transformStyle: 'preserve-3d',
        transition: mousePos ? 'none' : 'transform 0.1s ease-out'
      }}
    >
      <div className="absolute inset-0 bg-white/20" style={{ transform: 'translateZ(4px)' }} />
    </div>
  );
};

const CharacterView: React.FC<{ 
  name: string, 
  color: string, 
  isLocal?: boolean, 
  playerRef?: React.RefObject<HTMLDivElement | null>,
  x?: number,
  y?: number,
  z?: number,
  walking?: boolean,
  chat?: string,
  isDead?: boolean,
  bcType?: string,
  mousePos?: { x: number, y: number }
}> = ({ name, color, isLocal, playerRef, x, y, z, walking, chat, isDead, bcType, mousePos }) => {
  const leftLegRef = useRef<HTMLDivElement>(null);
  const rightLegRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      const time = Date.now() * 0.012;
      const amplitude = walking && !isDead ? 35 : 0;
      const angle = Math.sin(time) * amplitude;
      if (leftLegRef.current) leftLegRef.current.style.transform = `rotateX(${angle}deg)`;
      if (rightLegRef.current) rightLegRef.current.style.transform = `rotateX(${-angle}deg)`;
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [walking, isDead]);

  if (isDead) return null;

  const style: React.CSSProperties = isLocal ? {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: '28px',
    height: '42px',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
    zIndex: 10
  } : {
    position: 'absolute',
    left: `${50 + (x || 0) * SCALE}%`,
    top: `${50 - (y || 0) * SCALE}%`,
    width: '28px',
    height: '42px',
    transform: `translate(-50%, -50%) translateZ(${(z || 0) * SCALE}px)`,
    transformStyle: 'preserve-3d',
    transition: 'left 0.05s linear, top 0.05s linear, transform 0.05s linear'
  };

  const bcIcon = bcType === 'Classic' ? '👷' : bcType === 'Turbo' ? '🚀' : bcType === 'Outrageous' ? '🎩' : null;

  return (
    <div ref={playerRef} style={style}>
      {chat && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg border border-gray-400 text-[11px] font-bold text-black shadow-md whitespace-nowrap z-[200]">
          {chat}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-400" />
        </div>
      )}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm whitespace-nowrap z-[150] flex items-center space-x-1">
        {bcIcon && <span className="text-[8px]">{bcIcon}</span>}
        <span>{name}</span>
      </div>

      {/* VR Hands */}
      <Hand side="left" color={color} mousePos={isLocal ? mousePos : undefined} />
      <Hand side="right" color={color} mousePos={isLocal ? mousePos : undefined} />

      {/* Head */}
      <div className="w-7 h-7 bg-[#f5d0b8] rounded-sm border border-black/20 absolute -top-8 left-0.5" style={{ transform: 'translateZ(10px)' }} />
      {/* Torso */}
      <div className="w-10 h-14 rounded-sm border border-black/20 absolute top-0 -left-1 shadow-inner" style={{ backgroundColor: color }} />
      {/* Legs */}
      <div ref={leftLegRef} className="w-4 h-10 bg-gray-300 border border-black/20 absolute top-14 left-0 rounded-b-sm origin-top" />
      <div ref={rightLegRef} className="w-4 h-10 bg-gray-300 border border-black/20 absolute top-14 left-5 rounded-b-sm origin-top" />
    </div>
  );
};

interface PlayProps {
  game: GameExperience;
  onBack: () => void;
  user: UserProfile;
}

const Play: React.FC<PlayProps> = ({ game, onBack, user }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const spawnObj = game.objects.find(o => o.id === 'spawn') || { position: { x: 0, y: 0, z: 0 }, size: 4 };
  const spawnSurfaceZ = spawnObj.position.z + (spawnObj.size / 2);

  const pos = useRef({ x: spawnObj.position.x, y: spawnObj.position.y, z: spawnSurfaceZ + 2 });
  const vel = useRef({ x: 0, y: 0, z: 0 });
  const onGround = useRef(true);
  const keys = useRef<{ [key: string]: boolean }>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [health, setHealth] = useState(100);
  const [isWinning, setIsWinning] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [localChat, setLocalChat] = useState<{msg: string, time: number} | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const touchStartPos = useRef<{ x: number, y: number } | null>(null);
  const moveTouchId = useRef<number | null>(null);
  const jumpTouchId = useRef<number | null>(null);

  const [players, setPlayers] = useState<RemotePlayer[]>([
    { id: 'bot1', name: 'Guest 1337', x: spawnObj.position.x + 1, y: spawnObj.position.y, z: spawnSurfaceZ, color: '#444', isBot: true, targetX: spawnObj.position.x, targetY: spawnObj.position.y, lastChat: '', chatTime: 0, isJumping: false, isDead: false, respawnTime: 0 },
    { id: 'bot2', name: 'Builderman', x: spawnObj.position.x - 1, y: spawnObj.position.y, z: spawnSurfaceZ, color: '#FFD700', isBot: true, targetX: spawnObj.position.x, targetY: spawnObj.position.y, lastChat: '', chatTime: 0, isJumping: false, isDead: false, respawnTime: 0 },
    { id: 'bot3', name: 'Classic_Noob', x: spawnObj.position.x, y: spawnObj.position.y + 1, z: spawnSurfaceZ, color: '#33FF57', isBot: true, targetX: spawnObj.position.x, targetY: spawnObj.position.y, lastChat: '', chatTime: 0, isJumping: false, isDead: false, respawnTime: 0 },
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalizamos la posición del ratón de -1 a 1 relativo al centro de la pantalla
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    const handleDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const handleUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const width = window.innerWidth;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.clientX < width / 2) {
        if (moveTouchId.current === null) {
          moveTouchId.current = touch.identifier;
          touchStartPos.current = { x: touch.clientX, y: touch.clientY };
        }
      } else {
        if (jumpTouchId.current === null) {
          jumpTouchId.current = touch.identifier;
          keys.current[' '] = true;
          setTimeout(() => { keys.current[' '] = false; }, 100);
        }
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (moveTouchId.current === null || !touchStartPos.current) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === moveTouchId.current) {
        const dx = touch.clientX - touchStartPos.current.x;
        const dy = touch.clientY - touchStartPos.current.y;
        const threshold = 20;
        keys.current['w'] = dy < -threshold;
        keys.current['s'] = dy > threshold;
        keys.current['a'] = dx < -threshold;
        keys.current['d'] = dx > threshold;
        
        // Actualizamos mousePos también con el toque del joystick para que las manos se muevan
        setMousePos({
          x: (dx / 100),
          y: (dy / 100)
        });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === moveTouchId.current) {
        moveTouchId.current = null;
        touchStartPos.current = null;
        keys.current['w'] = false; keys.current['s'] = false;
        keys.current['a'] = false; keys.current['d'] = false;
        setMousePos({ x: 0, y: 0 });
      }
      if (touch.identifier === jumpTouchId.current) {
        jumpTouchId.current = null;
        keys.current[' '] = false;
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(current => current.map(p => {
        let nextP = { ...p };
        if (p.isDead) {
          if (Date.now() > p.respawnTime) {
            nextP.isDead = false;
            nextP.x = spawnObj.position.x + (Math.random() - 0.5);
            nextP.y = spawnObj.position.y + (Math.random() - 0.5);
            nextP.z = spawnSurfaceZ;
            nextP.lastChat = "I'm safe now!";
            nextP.chatTime = Date.now();
          }
          return nextP;
        }

        let onBlock = false;
        game.objects.forEach(obj => {
          const dx = p.x - obj.position.x;
          const dy = p.y - obj.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const halfSize = obj.size / 2;
          if (dist < halfSize) {
            if (obj.type === 'lava') {
                if (Math.abs(p.z - (obj.position.z + halfSize)) < 1) {
                    nextP.isDead = true;
                    nextP.lastChat = "OOF!";
                    nextP.chatTime = Date.now();
                    nextP.respawnTime = Date.now() + 3000;
                }
            } else onBlock = true;
          }
        });

        if (nextP.isDead) return nextP;

        if (onBlock) {
          if (Math.random() > 0.98) {
              nextP.targetX = p.x + (Math.random() - 0.5) * 2.5;
              nextP.targetY = p.y + (Math.random() - 0.5) * 2.5;
          }
          nextP.x += (nextP.targetX - p.x) * 0.05;
          nextP.y += (nextP.targetY - p.y) * 0.05;
        } else {
          const target = spawnObj.position;
          const dx = target.x - p.x;
          const dy = target.y - p.y;
          nextP.x += dx * 0.02;
          nextP.y += dy * 0.02;
        }

        if (Math.random() > 0.992 && !p.isJumping) {
          nextP.isJumping = true;
          setTimeout(() => {
            setPlayers(prev => prev.map(p2 => p2.id === p.id ? { ...p2, isJumping: false } : p2));
          }, 600);
        }

        if (nextP.isJumping) nextP.z = spawnSurfaceZ + 1.2;
        else nextP.z = spawnSurfaceZ;

        return nextP;
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [game.objects, spawnObj.position, spawnSurfaceZ]);

  useEffect(() => {
    let frameId: number;
    const runLoop = () => {
      if (isLoading || isWinning) {
        frameId = requestAnimationFrame(runLoop);
        return;
      }

      if (health <= 0 || pos.current.z < -15) {
        setHealth(100);
        pos.current = { x: spawnObj.position.x, y: spawnObj.position.y, z: spawnSurfaceZ + 5 };
        vel.current = { x: 0, y: 0, z: 0 };
        setLocalChat({ msg: "OOF!", time: Date.now() });
      }

      let move = false;
      const movePower = onGround.current ? ACCEL : ACCEL * 0.9;
      
      if (keys.current['w'] || keys.current['arrowup']) { vel.current.y += movePower; move = true; }
      if (keys.current['s'] || keys.current['arrowdown']) { vel.current.y -= movePower; move = true; }
      if (keys.current['a'] || keys.current['arrowleft']) { vel.current.x -= movePower; move = true; }
      if (keys.current['d'] || keys.current['arrowright']) { vel.current.x += movePower; move = true; }
      
      if ((keys.current[' '] || keys.current['spacebar']) && onGround.current) {
        vel.current.z = JUMP_FORCE;
        onGround.current = false;
      }

      setIsWalking(move);
      vel.current.x *= FRICTION;
      vel.current.y *= FRICTION;
      vel.current.z += GRAVITY;
      
      const speed = Math.sqrt(vel.current.x**2 + vel.current.y**2);
      if (speed > MAX_SPEED) {
        vel.current.x = (vel.current.x / speed) * MAX_SPEED;
        vel.current.y = (vel.current.y / speed) * MAX_SPEED;
      }
      
      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;
      pos.current.z += vel.current.z;
      
      let foundGround = false;

      game.objects.forEach(obj => {
        const dx = pos.current.x - obj.position.x;
        const dy = pos.current.y - obj.position.y;
        const dz = pos.current.z - obj.position.z;
        const halfSize = obj.size / 2;
        const margin = halfSize + 0.45;

        if (Math.abs(dx) < margin && Math.abs(dy) < margin) {
          const top = obj.position.z + halfSize;
          const bottom = obj.position.z - halfSize;

          if (pos.current.z >= top - 0.4 && pos.current.z <= top + 0.6 && vel.current.z <= 0) {
              pos.current.z = top;
              vel.current.z = 0;
              onGround.current = true;
              foundGround = true;
              if (obj.type === 'goal') setIsWinning(true);
              if (obj.type === 'lava') setHealth(h => Math.max(0, h - 15));
          } 
          else if (Math.abs(dz) < halfSize && obj.type !== 'lava') {
              const overlapX = margin - Math.abs(dx);
              const overlapY = margin - Math.abs(dy);
              if (overlapX < overlapY) {
                  pos.current.x += dx > 0 ? overlapX : -overlapX;
                  vel.current.x = 0;
              } else {
                  pos.current.y += dy > 0 ? overlapY : -overlapY;
                  vel.current.y = 0;
              }
          }
        }
      });

      if (!foundGround) onGround.current = false;

      if (playerRef.current) {
        playerRef.current.style.transform = `translate3d(-50%, -50%, 0) translate3d(${pos.current.x * SCALE}px, ${-pos.current.y * SCALE}px, ${pos.current.z * SCALE}px)`;
      }
      frameId = requestAnimationFrame(runLoop);
    };
    runLoop();
    return () => cancelAnimationFrame(frameId);
  }, [isLoading, isWinning, game.objects, health, spawnObj.position, spawnSurfaceZ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setLocalChat({ msg, time: Date.now() });
    setChatInput('');
    const aliveBots = players.filter(p => !p.isDead);
    if (aliveBots.length > 0) {
      const selectedBot = aliveBots[Math.floor(Math.random() * aliveBots.length)];
      const botResponse = await getBotResponse(msg, selectedBot.name);
      setPlayers(prev => prev.map(p => p.id === selectedBot.id ? { ...p, lastChat: botResponse, chatTime: Date.now() } : p));
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-[#87CEEB] z-[200] flex flex-col font-sans select-none overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      ref={containerRef}
    >
      <div className="h-9 bg-[#222] border-b border-black flex items-center justify-between px-2 text-white text-[11px] font-bold z-[210] pointer-events-auto">
        <div className="flex items-center space-x-4">
          <div className="bg-red-600 px-2 py-0.5 rounded-sm italic cursor-pointer shadow-md active:scale-95 transition-transform" onClick={onBack}>R</div>
          <span>{game.title}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-green-400 text-[10px]">VER: 2011.0.1</span>
          <button onClick={onBack} className="bg-gradient-to-b from-red-500 to-red-700 border border-red-900 px-3 py-0.5 rounded-sm shadow-inner active:brightness-90 text-[10px]">Leave</button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] to-[#B0E2FF]" />
        
        {moveTouchId.current !== null && touchStartPos.current && (
          <div 
            className="absolute z-[500] w-16 h-16 border-2 border-white/10 rounded-full flex items-center justify-center pointer-events-none"
            style={{ left: touchStartPos.current.x - 32, top: touchStartPos.current.y - 32 }}
          >
            <div className="w-8 h-8 bg-white/5 rounded-full" />
          </div>
        )}

        <div className="relative w-full h-full perspective-[1200px]">
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: 'rotateX(55deg) rotateZ(-25deg)', transformStyle: 'preserve-3d' }}
          >
            <div className="w-[8000px] h-[8000px] absolute bg-[#1a3d02] border border-[#0d1f01]" style={{ transform: 'translateZ(-150px)' }}>
              <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
            </div>
            
            <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
              {game.objects.map(obj => <Voxel key={obj.id} obj={obj} />)}
              {players.map(p => (
                <CharacterView 
                  key={p.id}
                  name={p.name}
                  color={p.color}
                  x={p.x}
                  y={p.y}
                  z={p.z}
                  walking={!p.isDead}
                  isDead={p.isDead}
                  chat={Date.now() - p.chatTime < 5000 ? p.lastChat : undefined}
                />
              ))}
              <CharacterView 
                name="You"
                color="#0074FF"
                isLocal={true}
                playerRef={playerRef}
                walking={isWalking}
                chat={localChat && (Date.now() - localChat.time < 5000) ? localChat.msg : undefined}
                bcType={user.buildersClub}
                mousePos={mousePos}
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 flex flex-col items-start space-y-4 max-w-[calc(100%-2rem)] pointer-events-auto">
            <div className="bg-black/40 p-2 rounded-sm border border-white/20">
              <div className="h-3 w-32 sm:w-48 bg-gray-800 border border-gray-600 rounded-sm overflow-hidden text-[8px] flex items-center justify-center text-white font-bold relative">
                HEALTH
                <div className={`absolute left-0 top-0 h-full transition-all ${health < 30 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} style={{ width: `${health}%`, zIndex: -1 }} />
              </div>
            </div>

            <div className="w-64 max-w-full h-44 bg-black/20 border border-white/10 p-2 overflow-hidden flex flex-col backdrop-blur-sm">
              <div className="flex-1 overflow-y-auto space-y-1 text-[11px] font-bold">
                {players.filter(p => Date.now() - p.chatTime < 15000 && p.lastChat).map(p => (
                  <p key={p.id + p.chatTime} className="text-white drop-shadow-md">
                    <span className="text-blue-400">[{p.name}]:</span> {p.lastChat}
                  </p>
                ))}
                {localChat && (Date.now() - localChat.time < 15000) && (
                  <p className="text-white drop-shadow-md">
                    <span className="text-yellow-400">[You]:</span> {localChat.msg}
                  </p>
                )}
              </div>
              <form onSubmit={handleSendChat} className="mt-2 flex">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 px-2 py-0.5 text-white text-[10px] focus:outline-none placeholder:text-white/30"
                  placeholder="Chat with players..."
                />
              </form>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-0 right-0 flex justify-between px-10 text-white/20 font-black italic uppercase text-sm pointer-events-none">
            <span>VR Mode Active - Move mouse to reach</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-[#e3e3e3] z-[300] flex flex-col items-center justify-center text-center">
          <div className="bg-white p-10 border border-gray-400 shadow-lg animate-pulse">
            <h2 className="text-4xl font-black italic mb-6 tracking-tighter"><span className="text-red-600">ROB</span>LOX</h2>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden mb-4 mx-auto">
              <div className="h-full bg-blue-600 w-[85%] animate-pulse" />
            </div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Calibrating VR Hands...</p>
          </div>
        </div>
      )}

      {isWinning && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-[300] flex items-center justify-center p-6">
          <div className="bg-white p-10 border-4 border-blue-600 shadow-2xl text-center max-w-sm w-full pointer-events-auto">
            <h2 className="text-4xl font-black text-blue-600 italic mb-6 uppercase">Course Complete!</h2>
            <button onClick={onBack} className="w-full bg-blue-600 text-white font-black py-4 rounded-sm uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all">Claim Victory</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
