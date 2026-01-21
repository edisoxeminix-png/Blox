
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

export interface BloxObject {
  id: string;
  type: 'box' | 'sphere' | 'npc' | 'goal' | 'lava';
  position: { x: number; y: number; z: number };
  color: string;
  size: number;
  label?: string;
  behavior?: string;
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
  outfits: string[];
  friends: FriendRelation[];
  pendingRequests: FriendRelation[];
  buildersClub: BuildersClubType;
  hasExecutor: boolean;
}
