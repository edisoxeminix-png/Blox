
export enum View {
  HOME = 'home',
  STUDIO = 'studio',
  PLAY = 'play',
  AVATAR = 'avatar',
  STORE = 'store',
  FRIENDS = 'friends',
  BUILDERS_CLUB = 'builders_club'
}

export type BuildersClubType = 'None' | 'Classic' | 'Turbo' | 'Outrageous';
export type BloxMaterial = 'plastic' | 'neon' | 'wood' | 'grass' | 'glass' | 'slate' | 'forcefield';

export interface BloxObject {
  id: string;
  type: 'box' | 'sphere' | 'npc' | 'goal' | 'lava' | 'wedge' | 'water' | 'sword' | 'hammer';
  position: { x: number; y: number; z: number };
  color: string;
  size: number;
  material?: BloxMaterial;
  label?: string;
  health?: number;
  behavior?: 'wander' | 'follow' | 'idle';
  // Add missing properties to support game logic and fix type errors
  isSafeZone?: boolean;
  isPickable?: boolean;
}

export interface GameExperience {
  id: string;
  title: string;
  description: string;
  creator: string;
  thumbnail: string;
  objects: BloxObject[];
  instructions: string;
}

export interface FriendRelation {
  username: string;
  status: 'online' | 'offline' | 'ingame';
  avatarColor: string;
  isPending?: boolean;
}

export interface UserProfile {
  username: string;
  avatarColor: string;
  bloxbucks: number;
  ownedItems: string[];
  equippedItems: string[];
  outfits: string[];
  friends: FriendRelation[];
  pendingRequests: FriendRelation[];
  buildersClub: BuildersClubType;
  hasArceusX: boolean; // Sustituye a hasExecutor
  isAdmin: boolean;
}
