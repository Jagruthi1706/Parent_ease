
export interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatar: string;
  milestones: Milestone[];
  activities: Activity[];
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  category: 'physical' | 'cognitive' | 'social' | 'academic';
}

export interface Activity {
  id: string;
  title: string;
  time: string;
  type: 'school' | 'extra' | 'health' | 'family';
  date?: string; // ISO date string
  location?: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
  points: number;
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'child' | 'household' | 'work';
}

export interface BudgetEntry {
  id: string;
  title: string;
  amount: number;
  category: 'school' | 'food' | 'health' | 'savings' | 'leisure';
  date: string;
  childId?: string;
}

export interface MealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string[];
}

export type ViewState = 
  | 'landing' 
  | 'sign-in'
  | 'onboarding' 
  | 'dashboard' 
  | 'schedule' 
  | 'child-profile' 
  | 'safety' 
  | 'tasks' 
  | 'meals' 
  | 'budgeting'
  | 'home-iot' 
  | 'community'
  | 'support' 
  | 'resources' 
  | 'pricing' 
  | 'help' 
  | 'contact' 
  | 'settings' 
  | 'about';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface Article {
  id: string;
  title: string;
  category: 'health' | 'education' | 'psychology' | 'activities';
  readTime: string;
  image: string;
  summary: string;
}

export interface SafetyAlert {
  id: string;
  type: 'location' | 'app' | 'sos';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  childId: string;
}

export interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'camera' | 'lock' | 'speaker';
  status: 'on' | 'off' | 'locked' | 'unlocked';
  value?: string | number; // e.g., temperature or brightness
  room: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string; // url
  title: string;
  content: string;
  likes: number;
  comments: number;
  category: 'Advice' | 'Rant' | 'School' | 'Health';
  isAnonymous: boolean;
  timeAgo: string;
}
