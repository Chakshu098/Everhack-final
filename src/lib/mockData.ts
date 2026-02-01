
import { v4 as uuidv4 } from 'uuid';

// --- Types ---

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
  avatar_url?: string;
  points?: number; // For leaderboard
  bio?: string;
  skills?: string[];
  github_handle?: string;
  linkedin_handle?: string;
}

export interface Team {
  id: string;
  name: string;
  event_id: string;
  leader_id: string;
  members: string[]; // user_ids
  looking_for: string[]; // skills
  description: string;
  max_members?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  event_type: 'Hackathon' | 'CTF' | 'Workshop';
  image_url: string;
  start_date: string;
  end_date: string;
  location: string;
  participants: number;
  max_participants: number;
  prize_pool: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  results_published?: boolean;
  rules?: string[];
  timeline?: { time: string; event: string }[];
  partners?: Partner[];
  organizer?: string;
}

export interface Partner {
  name: string;
  logo_url: string;
  website_url?: string;
}

export interface Registration {
  id: string;
  user_id: string;
  event_id: string;
  status: 'registered' | 'waitlist' | 'checked-in';
  registration_date: string;
  team_name?: string;
}

// --- Initial Data ---

const INITIAL_EVENTS: Event[] = [
  {
    id: "cyber-siege-2026",
    title: "Cyber Siege 2026",
    description: "The ultimate cybersecurity capture-the-flag competition.",
    longDescription: "Cyber Siege 2026 is the most anticipated CTF event of the year. Join thousands of security researchers, ethical hackers, and cybersecurity enthusiasts as they compete in challenges spanning web exploitation, reverse engineering, cryptography, forensics, and more.",
    event_type: "CTF",
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070", // Cyberpunk City
    start_date: "2026-02-15",
    end_date: "2026-02-17",
    location: "Online + San Francisco, CA",
    participants: 2500,
    max_participants: 5000,
    prize_pool: "$50,000",
    status: "upcoming",
    organizer: "CyberSec Foundation",
    rules: ["Teams of 1-4 members", "No sharing flags", "No attacking infra"],
    timeline: [{ time: "Day 1 9:00 AM", event: "Kickoff" }],
    partners: [
      { name: "TechCorp", logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=TechCorp", website_url: "https://example.com" },
      { name: "CyberSystems", logo_url: "https://api.dicebear.com/7.x/identicon/svg?seed=CyberSystems" }
    ]
  },
  {
    id: "buildverse-hackathon",
    title: "BuildVerse Hackathon",
    description: "Build the future of decentralized applications.",
    longDescription: "BuildVerse is a 48-hour hackathon focused on building the next generation of decentralized applications. Work alongside industry mentors from leading Web3 companies and compete for substantial prizes.",
    event_type: "Hackathon",
    image_url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832", // Abstract Blockchain
    start_date: "2026-03-08",
    end_date: "2026-03-10",
    location: "New York City, NY",
    participants: 1800,
    max_participants: 2500,
    prize_pool: "$100,000",
    status: "upcoming",
    organizer: "Web3 Builders Alliance",
    rules: ["Teams of 2-5", "Fresh code only"],
    timeline: [{ time: "Day 1 6:00 PM", event: "Hacking Starts" }]
  },
  {
    id: "web3-masterclass",
    title: "Web3 Masterclass",
    description: "Learn blockchain development from industry experts.",
    longDescription: "This comprehensive 8-hour workshop covers everything you need to know to start building on blockchain. From understanding smart contract fundamentals to deploying your first dApp.",
    event_type: "Workshop",
    image_url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=2787", // Tech Workshop
    start_date: "2026-01-20",
    end_date: "2026-01-20",
    location: "Online",
    participants: 500,
    max_participants: 1000,
    prize_pool: "Free",
    status: "completed",
    organizer: "EverHack Academy"
  }
];

const INITIAL_USERS: User[] = [
  {
    id: "admin-123",
    email: "admin@everhack.com",
    full_name: "System Admin",
    role: "admin",
    created_at: new Date().toISOString(),
    points: 9999
  },
  {
    id: "user-456",
    email: "demo@user.com",
    full_name: "Demo User",
    role: "user",
    created_at: new Date().toISOString(),
    points: 1200
  }
];

const INITIAL_LEADERBOARD = [
  { name: "ZeroCool", points: 2500, rank: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zero" },
  { name: "AcidBurn", points: 2350, rank: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Acid" },
  { name: "CerealKiller", points: 2100, rank: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cereal" },
  { name: "LordNikon", points: 1800, rank: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nikon" },
  { name: "CrashOverride", points: 1650, rank: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Crash" },
];


// --- LocalStorage Helpers ---

const STORAGE_KEYS = {
  USERS: 'everhack_users',
  EVENTS: 'everhack_events',

  REGISTRATIONS: 'everhack_registrations',
  TEAMS: 'everhack_teams',
  CURRENT_USER: 'everhack_current_user' // Simple session persistence
};

function getFromStorage<T>(key: string, defaultVal: T): T {
  const item = localStorage.getItem(key);
  if (!item) return defaultVal;
  try {
    return JSON.parse(item);
  } catch {
    return defaultVal;
  }
}

function saveToStorage(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Service Functions ---

export const mockAuth = {
  signIn: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === "admin@everhack.com" && password === "EverHack@123") {
      const admin: User = INITIAL_USERS[0];
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(admin));
      return { user: admin, error: null };
    }

    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const user = users.find(u => u.email === email);

    // Simple password check (in a real app, never store plain passwords, and here we are just "pretending" any password works for non-admin for simplicity, OR we can enforce a dummy logic)
    // For this mock, we'll adhere to the component logic:

    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return { user, error: null };
    }

    return { user: null, error: "Invalid login credentials." };
  },

  signUp: async (email: string, password: string, fullName: string): Promise<{ user: User | null; error: string | null }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (users.find(u => u.email === email)) {
      return { user: null, error: "User already exists." };
    }

    const newUser: User = {
      id: uuidv4(),
      email,
      full_name: fullName,
      role: 'user',
      created_at: new Date().toISOString(),
      points: 0
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    return { user: newUser, error: null };
  },

  signOut: async () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  updateProfile: async (updates: Partial<User>) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const currentUser = getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!currentUser) throw new Error("Not logged in");

    const updatedUser = { ...currentUser, ...updates };

    // Update in users array
    let users = getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    users = users.map(u => u.id === currentUser.id ? updatedUser : u);
    saveToStorage(STORAGE_KEYS.USERS, users);

    // Update session
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    return updatedUser;
  }
};

export const mockDb = {
  getEvents: async (): Promise<Event[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const events = getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    return events.find(e => e.id === id);
  },

  createEvent: async (event: Omit<Event, 'id'>) => {
    const events = getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const newEvent = { ...event, id: uuidv4() };
    events.push(newEvent);
    saveToStorage(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },

  updateEvent: async (event: Event) => {
    let events = getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    events = events.map(e => e.id === event.id ? event : e);
    saveToStorage(STORAGE_KEYS.EVENTS, events);
    return event;
  },

  deleteEvent: async (id: string) => {
    let events = getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    events = events.filter(e => e.id !== id);
    saveToStorage(STORAGE_KEYS.EVENTS, events);
  },

  getRegistrations: async (userId: string): Promise<Registration[]> => {
    const allRegs = getFromStorage<Registration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    return allRegs.filter(r => r.user_id === userId);
  },

  registerForEvent: async (userId: string, eventId: string) => {
    const regs = getFromStorage<Registration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    if (regs.find(r => r.user_id === userId && r.event_id === eventId)) {
      throw new Error("Already registered");
    }
    const newReg: Registration = {
      id: uuidv4(),
      user_id: userId,
      event_id: eventId,
      status: 'registered',
      registration_date: new Date().toISOString()
    };
    regs.push(newReg);
    saveToStorage(STORAGE_KEYS.REGISTRATIONS, regs);

    // Update participants count
    const events = getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    const eventIdx = events.findIndex(e => e.id === eventId);
    if (eventIdx >= 0) {
      events[eventIdx].participants += 1;
      saveToStorage(STORAGE_KEYS.EVENTS, events);
    }

    return newReg;
  },

  getLeaderboard: async () => {
    return INITIAL_LEADERBOARD;
  },

  // --- Team Functions ---

  getTeams: async (): Promise<Team[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getFromStorage<Team[]>(STORAGE_KEYS.TEAMS, []);
  },

  createTeam: async (team: Omit<Team, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const teams = getFromStorage<Team[]>(STORAGE_KEYS.TEAMS, []);
    const newTeam: Team = {
      ...team,
      id: uuidv4(),
      max_members: team.max_members || 4
    };
    teams.push(newTeam);
    saveToStorage(STORAGE_KEYS.TEAMS, teams);
    return newTeam;
  },

  joinTeam: async (teamId: string, userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    let teams = getFromStorage<Team[]>(STORAGE_KEYS.TEAMS, []);
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) throw new Error("Team not found");
    const team = teams[teamIndex];

    if (team.members.includes(userId)) throw new Error("Already a member");

    // Check limit
    if (team.members.length >= (team.max_members || 4)) {
      throw new Error("Sorry, the team is full. You can't join.");
    }

    team.members.push(userId);
    teams[teamIndex] = team;
    saveToStorage(STORAGE_KEYS.TEAMS, teams);
    return team;
  },

  // --- Registration Functions ---

  cancelRegistration: async (userId: string, eventId: string) => {
    let regs = getFromStorage<Registration[]>(STORAGE_KEYS.REGISTRATIONS, []);
    const initialLength = regs.length;
    regs = regs.filter(r => !(r.user_id === userId && r.event_id === eventId));

    if (regs.length !== initialLength) {
      saveToStorage(STORAGE_KEYS.REGISTRATIONS, regs);

      // Decrement participant count
      const events = getFromStorage<Event[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
      const eventIdx = events.findIndex(e => e.id === eventId);
      if (eventIdx >= 0 && events[eventIdx].participants > 0) {
        events[eventIdx].participants -= 1;
        saveToStorage(STORAGE_KEYS.EVENTS, events);
      }
    }
  },

  // --- Admin User Functions ---

  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  deleteUser: async (userId: string) => {
    let users = getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    users = users.filter(u => u.id !== userId);
    saveToStorage(STORAGE_KEYS.USERS, users);
  }
};
