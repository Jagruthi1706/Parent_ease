
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Sparkles, Send, Bot, User, Map as MapIcon, 
  PlusCircle, BrainCircuit, ChefHat, Monitor, Heart, 
  Shield, Calendar as CalendarIcon, ChevronRight, Activity, 
  CheckCircle2, Bell, Home, Settings, HelpCircle, 
  MessageSquare, Info, Smartphone, Star,
  Search, ArrowRight, Play, Wallet, TrendingDown, TrendingUp, PiggyBank, Briefcase,
  Instagram, Facebook, Twitter, Trash2, Edit3, Save, Share2, MapPin, ClipboardList,
  Target, Zap, Coffee, ShoppingBag, Clock, Power, Thermometer, Lightbulb, Lock,
  BookOpen, Smile, LifeBuoy, Eye, EyeOff, Mail, LockKeyhole, AlertTriangle, Users,
  List, Filter, Video, FileText, UserPlus, Phone, MessageCircle, ThumbsUp, ToggleRight, ToggleLeft, LogOut
} from 'lucide-react';
import { ViewState, Child, Task, BudgetEntry, Message, MealPlan, SafetyAlert, Article, SmartDevice, CommunityPost } from './types';
import { getSmartSchedule, getMealSuggestions, getSupportAdvice, getBudgetAdvice } from './geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeChildId, setActiveChildId] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  
  // Auth & Onboarding State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [parentName, setParentName] = useState('Sarah');
  const [parentType, setParentType] = useState('Working Parent');

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your Parent Ease assistant. How can I help you and your family today?' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Shared Data
  const [children, setChildren] = useState<Child[]>([
    { id: '1', name: 'Aryan', age: 7, grade: '2nd', avatar: 'https://i.pravatar.cc/200?u=aryan', milestones: [], activities: [{ id: 'a1', title: 'Math Test', time: '09:00', type: 'school', location: 'St. Pauls School' }] },
    { id: '2', name: 'Zoya', age: 4, grade: 'Pre-K', avatar: 'https://i.pravatar.cc/200?u=zoya', milestones: [], activities: [{ id: 'a2', title: 'Dance Class', time: '16:30', type: 'extra', location: 'City Dance Studio' }] }
  ]);

  const [expenses] = useState<BudgetEntry[]>([
    { id: 'e1', title: 'School Fees', amount: 15000, category: 'school', date: '2026-02-10', childId: '1' },
    { id: 'e2', title: 'Groceries', amount: 4500, category: 'food', date: '2026-02-12' },
    { id: 'e3', title: 'Toy Purchase', amount: 1200, category: 'leisure', date: '2026-02-14', childId: '2' },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Buy school uniform', assignee: 'Sarah', dueDate: '10:00', completed: false, points: 50, priority: 'high', category: 'child' },
    { id: 't2', title: 'Doctor Appointment', assignee: 'Aryan', dueDate: '14:00', completed: false, points: 30, priority: 'medium', category: 'child' },
    { id: 't3', title: 'Water the plants', assignee: 'Aryan', dueDate: '17:00', completed: true, points: 10, priority: 'low', category: 'household' },
    { id: 't4', title: 'Review Math Homework', assignee: 'Sarah', dueDate: '18:00', completed: false, points: 20, priority: 'high', category: 'child' },
    { id: 't5', title: 'Pay Electricity Bill', assignee: 'Dad', dueDate: '20:00', completed: false, points: 10, priority: 'high', category: 'household' },
  ]);

  const [safetyAlerts] = useState<SafetyAlert[]>([
    { id: 's1', type: 'location', message: 'Aryan arrived at School Safe Zone', timestamp: '08:45 AM', severity: 'low', childId: '1' },
    { id: 's2', type: 'app', message: 'High screen time detected for Zoya', timestamp: 'Yesterday', severity: 'medium', childId: '2' }
  ]);

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([
    { day: 'Monday', breakfast: 'Oatmeal & Berries', lunch: 'Veggie Wrap', dinner: 'Grilled Chicken & Rice', snacks: ['Apple', 'Yogurt'] }
  ]);

  const [resources] = useState<Article[]>([
    { id: 'r1', title: 'Managing Screen Time Effectively', category: 'education', readTime: '5 min', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400', summary: 'Tips to balance digital life for kids under 10.' },
    { id: 'r2', title: 'Healthy Lunchbox Ideas', category: 'health', readTime: '3 min', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400', summary: 'Nutritious and quick recipes for busy mornings.' },
    { id: 'r3', title: 'Dealing with Tantrums', category: 'psychology', readTime: '7 min', image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400', summary: 'Understanding the emotional triggers behind outbursts.' },
  ]);

  const [smartDevices, setSmartDevices] = useState<SmartDevice[]>([
    { id: 'd1', name: 'Nursery Camera', type: 'camera', status: 'on', room: 'Kids Room' },
    { id: 'd2', name: 'Living Room Lights', type: 'light', status: 'off', value: 80, room: 'Living Room' },
    { id: 'd3', name: 'Main Door Lock', type: 'lock', status: 'locked', room: 'Entrance' },
    { id: 'd4', name: 'Thermostat', type: 'thermostat', status: 'on', value: '22°C', room: 'Hallway' },
  ]);

  const [communityPosts] = useState<CommunityPost[]>([
    { id: 'p1', author: 'MomOfTwo', avatar: 'https://i.pravatar.cc/100?u=10', title: 'How do you handle homework resistance?', content: 'My 7 year old refuses to sit down for math. Any tips?', likes: 24, comments: 8, category: 'Advice', isAnonymous: false, timeAgo: '2h ago' },
    { id: 'p2', author: 'Anonymous', avatar: '', title: 'Feeling overwhelmed with work-life balance', content: 'Just need to vent. It is hard doing it all alone sometimes.', likes: 156, comments: 45, category: 'Rant', isAnonymous: true, timeAgo: '5h ago' },
  ]);

  const activeChild = children.find(c => c.id === activeChildId) || children[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user' as const, text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setLoading(true);

    try {
      const advice = await getSupportAdvice(chatInput, chatHistory);
      setChatHistory(prev => [...prev, { role: 'model', text: advice }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my sapphire neural link. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDevice = (id: string) => {
    setSmartDevices(prev => prev.map(d => {
      if (d.id === id) {
        if (d.type === 'lock') return { ...d, status: d.status === 'locked' ? 'unlocked' : 'locked' };
        return { ...d, status: d.status === 'on' ? 'off' : 'on' };
      }
      return d;
    }));
  };

  // Components
  const TopBar = () => (
    <div className="sticky top-0 z-[100] glass px-6 py-4 flex justify-between items-center border-b border-blue-100">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
          <Menu size={24} />
        </button>
        <div onClick={() => setView('dashboard')} className="flex items-center gap-2 cursor-pointer group">
          <div className="p-2 sapphire-gradient rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform"><Heart size={20} fill="white" /></div>
          <span className="font-bold text-xl text-blue-900 hidden sm:inline">Parent Ease</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => setView('support')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors hidden md:block"><Bot size={20}/></button>
        <button className="p-2 text-slate-400 hover:text-blue-600 relative">
          <Bell size={20}/><span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button>
        <button onClick={() => setView('settings')} className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white rounded-full soft-shadow hover:scale-105 transition-all border border-blue-50">
          <div className="w-8 h-8 bg-blue-100 rounded-full overflow-hidden shadow-sm">
            <img src="https://i.pravatar.cc/100?u=sarah" alt="user" />
          </div>
          <span className="font-bold text-sm text-slate-700 hidden sm:inline">{parentName}</span>
        </button>
      </div>
    </div>
  );

  const Footer = () => (
    <footer className="py-12 px-6 bg-white border-t border-blue-50 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
            <Heart size={28} fill="currentColor" /> Parent Ease
          </div>
          <p className="text-slate-500 max-w-sm">Simplifying family life in 2026 through the sapphire standard of parenting intelligence.</p>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Features</h4>
          <ul className="space-y-2 text-slate-500 text-sm">
            <li><button onClick={() => setView('schedule')} className="hover:text-blue-600">Scheduler</button></li>
            <li><button onClick={() => setView('meals')} className="hover:text-blue-600">Meal Planner</button></li>
            <li><button onClick={() => setView('safety')} className="hover:text-blue-600">Safety Center</button></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Company</h4>
          <ul className="space-y-2 text-slate-500 text-sm">
            <li><button onClick={() => setView('about')} className="hover:text-blue-600">Our Vision</button></li>
            <li><button onClick={() => setView('help')} className="hover:text-blue-600">Help Center</button></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 text-center text-[10px] text-slate-400 font-bold tracking-[0.3em] border-t border-slate-50 pt-8 uppercase">
        &copy; 2026 Parent Ease. Excellence in Parenting.
      </div>
    </footer>
  );

  const SideMenu = ({ isMobile = false }) => (
    <aside className={`bg-white flex-col p-6 z-[110] ${
      isMobile 
        ? 'flex h-full w-full' 
        : 'fixed left-0 top-0 h-screen w-72 border-r border-blue-50 hidden lg:flex'
    }`}>
      <div className="flex items-center justify-between text-blue-600 mb-12 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 sapphire-gradient rounded-xl text-white"><Heart size={24} fill="white" /></div>
          <span className="text-xl font-bold tracking-tight text-blue-900">Parent Ease</span>
        </div>
        {isMobile && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 hide-scrollbar pb-6">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'schedule', label: 'Scheduler', icon: CalendarIcon },
          { id: 'tasks', label: 'Tasks & Chores', icon: ClipboardList },
          { id: 'meals', label: 'Meal Planner', icon: ChefHat },
          { id: 'safety', label: 'Safety Center', icon: Shield },
          { id: 'child-profile', label: 'Children', icon: User },
          { id: 'budgeting', label: 'Budget', icon: Wallet },
          { id: 'home-iot', label: 'Smart Home', icon: Monitor },
          { id: 'community', label: 'Community', icon: Users },
          { id: 'resources', label: 'Resources', icon: BookOpen },
          { id: 'support', label: 'AI Assistant', icon: Bot },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'help', label: 'Help & Support', icon: HelpCircle },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => { setView(item.id as ViewState); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold ${
              view === item.id ? 'sapphire-gradient text-white shadow-lg' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50/50'
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      {/* Sign Out Logic */}
      <button onClick={() => { setIsLoggedIn(false); setView('landing'); }} className="mt-4 flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold">
        <LogOut size={20} />
        <span className="text-sm">Sign Out</span>
      </button>
    </aside>
  );

  const ScheduleView = () => {
    const [optimizing, setOptimizing] = useState(false);
    const [aiMessage, setAiMessage] = useState<string | null>(null);

    const handleOptimize = async () => {
      setOptimizing(true);
      try {
        const advice = await getSmartSchedule(tasks, `Parent Context: ${parentType}. Busy with work deadlines.`);
        setAiMessage(advice);
      } catch (e) {
        setAiMessage("Could not optimize schedule right now.");
      } finally {
        setOptimizing(false);
      }
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="space-y-8 fade-in-view max-w-6xl mx-auto">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Time Management</h2>
            <h1 className="text-4xl font-bold text-slate-900">Smart Scheduler</h1>
          </div>
          <button 
            onClick={handleOptimize}
            className="px-6 py-3 sapphire-gradient text-white rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
            disabled={optimizing}
          >
            {optimizing ? <Sparkles className="animate-spin" size={18} /> : <Sparkles size={18} />}
            AI Optimize Schedule
          </button>
        </header>

        {aiMessage && (
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl animate-in fade-in flex gap-4">
             <Bot className="text-indigo-600 flex-shrink-0" size={24} />
             <div>
               <h4 className="font-bold text-indigo-900 mb-1">Optimization Complete</h4>
               <p className="text-indigo-700 text-sm leading-relaxed">{aiMessage}</p>
             </div>
             <button onClick={() => setAiMessage(null)} className="ml-auto text-indigo-400 hover:text-indigo-600"><X size={20}/></button>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
           <div className="space-y-4">
              <div className="bg-white p-6 rounded-[2rem] border border-blue-50 soft-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900">February 2026</h3>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-slate-100 rounded-lg"><ChevronRight className="rotate-180" size={16}/></button>
                    <button className="p-1 hover:bg-slate-100 rounded-lg"><ChevronRight size={16}/></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                   {days.map(d => <span key={d}>{d[0]}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                   {Array.from({length: 28}, (_, i) => i + 1).map(d => (
                     <button key={d} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${d === 10 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-blue-50 text-slate-600'}`}>
                       {d}
                     </button>
                   ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border border-blue-50 soft-shadow space-y-3">
                 <h3 className="font-bold text-slate-900">Filters</h3>
                 {['Work', 'School', 'Health', 'Family'].map(cat => (
                   <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border-2 border-slate-300 ${cat === 'Work' ? 'bg-blue-500 border-blue-500' : ''} group-hover:border-blue-400`}></div>
                      <span className="text-sm font-medium text-slate-600">{cat}</span>
                   </label>
                 ))}
              </div>
           </div>

           <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 soft-shadow min-h-[600px]">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-xl text-slate-800">Today, Feb 10</h3>
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">+ Add Event</button>
                 </div>
                 
                 <div className="space-y-4 relative">
                    <div className="absolute left-[59px] top-0 bottom-0 w-px bg-slate-100"></div>
                    {[
                      { time: '08:00', title: 'School Drop-off', duration: '30m', type: 'school', child: 'Aryan' },
                      { time: '09:00', title: 'Team Standup', duration: '1h', type: 'work', child: null },
                      { time: '14:00', title: 'Doctor Appointment', duration: '45m', type: 'health', child: 'Aryan' },
                      { time: '16:30', title: 'Dance Class', duration: '1h', type: 'extra', child: 'Zoya' },
                      { time: '18:00', title: 'Math Homework Review', duration: '30m', type: 'school', child: 'Aryan' },
                    ].map((ev, i) => (
                      <div key={i} className="flex items-start gap-4 group">
                         <span className="w-12 text-right text-xs font-bold text-slate-400 pt-3">{ev.time}</span>
                         <div className={`flex-1 p-4 rounded-2xl border transition-all ${
                            ev.type === 'work' ? 'bg-slate-50 border-slate-100 hover:border-slate-300' :
                            ev.type === 'school' ? 'bg-blue-50 border-blue-100 hover:border-blue-300' :
                            ev.type === 'health' ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-300' :
                            'bg-orange-50 border-orange-100 hover:border-orange-300'
                         }`}>
                            <div className="flex justify-between items-start">
                               <div>
                                  <h4 className="font-bold text-slate-900">{ev.title}</h4>
                                  <p className="text-xs font-medium opacity-70 mt-1">{ev.duration} • {ev.type.toUpperCase()}</p>
                               </div>
                               {ev.child && (
                                  <div className="px-2 py-1 bg-white/50 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                     {ev.child}
                                  </div>
                               )}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const SmartHomeView = () => (
    <div className="space-y-8 fade-in-view max-w-6xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Connected Living</h2>
          <h1 className="text-4xl font-bold text-slate-900">Smart Home</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
             <PlusCircle size={18} /> Add Device
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Scenes */}
        <div className="col-span-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-[2rem] text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
            <div className="flex justify-between items-start mb-8">
              <span className="p-3 bg-white/20 rounded-xl backdrop-blur-md"><Coffee size={24} /></span>
              <ToggleRight size={28} className="text-white/80" />
            </div>
            <h3 className="font-bold text-lg">Morning Routine</h3>
            <p className="text-blue-100 text-sm">Blinds open, coffee on</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-[2rem] text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
             <div className="flex justify-between items-start mb-8">
              <span className="p-3 bg-white/20 rounded-xl backdrop-blur-md"><Zap size={24} /></span>
              <ToggleLeft size={28} className="text-slate-400" />
            </div>
            <h3 className="font-bold text-lg">Night Mode</h3>
            <p className="text-slate-400 text-sm">All locks secure, lights off</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-blue-50 soft-shadow cursor-pointer hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start mb-8">
              <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Shield size={24} /></span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-600 px-2 py-1 rounded-lg">ACTIVE</span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Security System</h3>
            <p className="text-slate-400 text-sm">Monitoring perimeters</p>
          </div>
        </div>

        {/* Devices List */}
        {smartDevices.map(device => (
          <div key={device.id} onClick={() => toggleDevice(device.id)} className={`p-6 rounded-[2rem] border soft-shadow cursor-pointer transition-all ${
            device.status === 'on' || device.status === 'locked' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-900 border-blue-50 hover:border-blue-200'
          }`}>
             <div className="flex justify-between items-start mb-6">
                <span className={`p-3 rounded-xl ${
                  device.status === 'on' || device.status === 'locked' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'
                }`}>
                   {device.type === 'light' && <Lightbulb size={24} />}
                   {device.type === 'thermostat' && <Thermometer size={24} />}
                   {device.type === 'camera' && <Video size={24} />}
                   {device.type === 'lock' && (device.status === 'locked' ? <Lock size={24} /> : <LockKeyhole size={24} />)}
                </span>
                <div className={`w-3 h-3 rounded-full ${device.status === 'on' || device.status === 'locked' ? 'bg-green-400' : 'bg-slate-200'}`}></div>
             </div>
             <h4 className="font-bold text-lg leading-tight">{device.name}</h4>
             <p className={`text-sm mt-1 ${device.status === 'on' || device.status === 'locked' ? 'text-blue-100' : 'text-slate-400'}`}>
                {device.value ? device.value : device.room}
             </p>
             <div className="mt-4 text-xs font-bold uppercase tracking-widest opacity-80">
                {device.status}
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CommunityView = () => (
    <div className="space-y-8 fade-in-view max-w-5xl mx-auto">
       <header className="flex justify-between items-end">
        <div>
          <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Parent Village</h2>
          <h1 className="text-4xl font-bold text-slate-900">Community</h1>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-blue-700 transition-colors">
           <Edit3 size={18} /> New Post
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
         {['Trending', 'Advice', 'Rant', 'School', 'Health', 'Local Events'].map((filter, i) => (
            <button key={filter} className={`px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${i === 0 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
               {filter}
            </button>
         ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            {communityPosts.map(post => (
               <div key={post.id} className="bg-white p-6 rounded-[2.5rem] border border-blue-50 soft-shadow">
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${post.isAnonymous ? 'bg-slate-100' : ''}`}>
                           {post.isAnonymous ? <User size={20} className="text-slate-400" /> : <img src={post.avatar} alt="u" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                           <p className="font-bold text-slate-900 text-sm">{post.author}</p>
                           <p className="text-xs text-slate-400">{post.timeAgo} • {post.category}</p>
                        </div>
                     </div>
                     <button className="text-slate-300 hover:text-slate-600"><Settings size={16} /></button>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{post.content}</p>
                  <div className="flex gap-4 border-t border-slate-50 pt-4">
                     <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs transition-colors">
                        <ThumbsUp size={16} /> {post.likes} Helpful
                     </button>
                     <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs transition-colors">
                        <MessageCircle size={16} /> {post.comments} Comments
                     </button>
                     <button className="ml-auto flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs transition-colors">
                        <Share2 size={16} /> Share
                     </button>
                  </div>
               </div>
            ))}
         </div>

         <div className="space-y-6">
            <div className="sapphire-gradient p-8 rounded-[2.5rem] text-white shadow-xl">
               <h3 className="font-bold text-xl mb-2">Community Guidelines</h3>
               <p className="text-blue-100 text-sm opacity-90 leading-relaxed mb-4">We are a judgment-free zone. Please be kind, supportive, and respectful to all parents.</p>
               <button className="text-xs font-bold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">Read Full Policy</button>
            </div>
            
            <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 soft-shadow">
               <h3 className="font-bold text-slate-900 mb-4">Popular Topics</h3>
               <div className="flex flex-wrap gap-2">
                  {['#pottytraining', '#teens', '#screenlimits', '#mealprep', '#summercamp'].map(tag => (
                     <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">{tag}</span>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="space-y-8 fade-in-view max-w-4xl mx-auto">
      <header>
          <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Configuration</h2>
          <h1 className="text-4xl font-bold text-slate-900">Settings & Profile</h1>
      </header>
      
      <div className="grid md:grid-cols-3 gap-8">
         <div className="bg-white p-6 rounded-[2.5rem] border border-blue-50 soft-shadow h-fit">
            <div className="flex flex-col items-center text-center space-y-4 mb-6">
               <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50">
                  <img src="https://i.pravatar.cc/150?u=sarah" alt="Profile" className="w-full h-full object-cover" />
               </div>
               <div>
                  <h3 className="font-bold text-xl text-slate-900">{parentName}</h3>
                  <p className="text-sm text-slate-400">{parentType}</p>
               </div>
               <button className="text-blue-600 font-bold text-xs border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-50">Change Avatar</button>
            </div>
            <div className="space-y-1">
               {['Profile', 'Family Members', 'Notifications', 'Privacy', 'Subscription'].map((item, i) => (
                  <button key={item} className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-colors ${i === 0 ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
                     {item}
                  </button>
               ))}
            </div>
         </div>

         <div className="md:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-[2.5rem] border border-blue-50 soft-shadow space-y-6">
               <h3 className="font-bold text-lg text-slate-900 border-b border-slate-50 pb-4">Personal Details</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase">First Name</label>
                     <input type="text" value={parentName} onChange={(e) => setParentName(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase">Parent Type</label>
                     <select value={parentType} onChange={(e) => setParentType(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 appearance-none">
                        <option>Working Parent</option>
                        <option>Stay-at-Home Parent</option>
                        <option>Single Parent</option>
                        <option>New Parent</option>
                     </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                     <input type="email" value="sarah@parentease.ai" disabled className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-400 outline-none" />
                  </div>
               </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] border border-blue-50 soft-shadow space-y-6">
               <h3 className="font-bold text-lg text-slate-900 border-b border-slate-50 pb-4">Family Management</h3>
               {children.map(child => (
                  <div key={child.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                     <div className="flex items-center gap-4">
                        <img src={child.avatar} alt={child.name} className="w-10 h-10 rounded-full" />
                        <div>
                           <p className="font-bold text-slate-900 text-sm">{child.name}</p>
                           <p className="text-xs text-slate-400">{child.age} Years • Grade {child.grade}</p>
                        </div>
                     </div>
                     <button className="text-slate-400 hover:text-blue-600"><Edit3 size={18} /></button>
                  </div>
               ))}
               <button className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all flex justify-center gap-2">
                  <PlusCircle size={20} /> Add Family Member
               </button>
            </section>
            
            <div className="flex justify-end gap-4">
               <button className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
               <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
         </div>
      </div>
    </div>
  );

  const HelpView = () => (
     <div className="space-y-8 fade-in-view max-w-4xl mx-auto">
        <header className="text-center py-8">
           <h1 className="text-4xl font-bold text-slate-900 mb-2">How can we help you?</h1>
           <p className="text-slate-500">Search for answers or get in touch with our support team.</p>
           <div className="mt-6 relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search help articles..." className="w-full pl-12 pr-6 py-4 bg-white border border-blue-50 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-100" />
           </div>
        </header>
        
        <div className="grid md:grid-cols-3 gap-6">
           {['Getting Started', 'Account & Billing', 'Troubleshooting'].map(cat => (
              <div key={cat} className="bg-white p-6 rounded-[2rem] border border-blue-50 soft-shadow text-center hover:border-blue-200 transition-colors cursor-pointer">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={24} />
                 </div>
                 <h3 className="font-bold text-slate-900">{cat}</h3>
              </div>
           ))}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 soft-shadow">
           <h3 className="font-bold text-xl text-slate-900 mb-6">Frequently Asked Questions</h3>
           <div className="space-y-4">
              {[
                 'How do I sync my Google Calendar?',
                 'Can I add a second parent account?',
                 'How does the AI safety monitoring work?',
                 'Is my family data private?'
              ].map(q => (
                 <div key={q} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100">
                    <span className="font-bold text-sm text-slate-700">{q}</span>
                    <ChevronRight size={18} className="text-slate-400" />
                 </div>
              ))}
           </div>
        </div>

        <div className="text-center pt-8">
           <p className="text-slate-500 font-medium mb-4">Still need help?</p>
           <button onClick={() => setView('contact')} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-colors">Contact Support</button>
        </div>
     </div>
  );

  const TasksView = () => {
    return (
      <div className="space-y-8 fade-in-view max-w-6xl mx-auto">
         <header className="flex justify-between items-end">
            <div>
               <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Household & Chores</h2>
               <h1 className="text-4xl font-bold text-slate-900">Task Center</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border border-yellow-100">
                  <Star size={16} fill="currentColor" />
                  Aryan: 350 pts
               </div>
               <button className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform"><PlusCircle size={24}/></button>
            </div>
         </header>

         <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white p-2 rounded-[2rem] border border-blue-50 soft-shadow inline-flex">
                  {['All', 'Child', 'Household', 'Work'].map(filter => (
                     <button key={filter} className="px-6 py-3 rounded-[1.5rem] font-bold text-sm text-slate-500 hover:bg-slate-50 focus:bg-blue-600 focus:text-white transition-all">
                        {filter}
                     </button>
                  ))}
               </div>

               <div className="space-y-4">
                  {tasks.map(task => (
                     <div key={task.id} className="group flex items-center gap-4 p-6 bg-white rounded-[2rem] border border-blue-50 soft-shadow hover:border-blue-200 transition-all cursor-pointer">
                        <button className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent hover:border-blue-400'}`}>
                           <CheckCircle2 size={18} />
                        </button>
                        <div className="flex-1">
                           <h4 className={`font-bold text-lg text-slate-900 ${task.completed ? 'line-through opacity-50' : ''}`}>{task.title}</h4>
                           <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{task.category}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span className="text-xs font-bold text-slate-400">Due {task.dueDate}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <div className="flex -space-x-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600">
                                 {task.assignee[0]}
                              </div>
                           </div>
                           <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">+{task.points} pts</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <div className="sapphire-gradient p-8 rounded-[2.5rem] text-white shadow-xl">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><Target size={24}/> Weekly Goal</h3>
                  <div className="mb-2 flex justify-between text-sm font-medium opacity-90">
                     <span>Review Homework</span>
                     <span>4/5 days</span>
                  </div>
                  <div className="h-3 bg-blue-900/30 rounded-full overflow-hidden mb-6">
                     <div className="h-full bg-white w-[80%]"></div>
                  </div>
                  <p className="text-sm opacity-80 leading-relaxed">Keep it up! Consistency in reviewing homework is improving Aryan's grades.</p>
               </div>
               
               <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 soft-shadow">
                  <h3 className="font-bold text-lg text-slate-900 mb-6">Suggestions</h3>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Sparkles size={20}/></div>
                        <div>
                           <p className="text-sm font-bold text-slate-800">Clean Toy Room</p>
                           <p className="text-xs text-slate-400">Recurring • +20 pts</p>
                        </div>
                        <button className="ml-auto p-2 hover:bg-slate-50 rounded-lg text-slate-400"><PlusCircle size={20}/></button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  };

  const MealsView = () => {
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
       setGenerating(true);
       try {
          const suggestions = await getMealSuggestions("Healthy, Kid-friendly, Vegetarian options, Quick dinner");
          setMealPlans(suggestions);
       } catch (e) {
          console.error(e);
       } finally {
          setGenerating(false);
       }
    };

    return (
      <div className="space-y-8 fade-in-view max-w-6xl mx-auto">
         <header className="flex justify-between items-end">
            <div>
               <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Nutrition & Planning</h2>
               <h1 className="text-4xl font-bold text-slate-900">Meal Planner</h1>
            </div>
            <div className="flex gap-3">
               <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <ShoppingBag size={18} /> Grocery List
               </button>
               <button 
                  onClick={handleGenerate} 
                  disabled={generating}
                  className="px-6 py-3 sapphire-gradient text-white rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
               >
                  {generating ? <ChefHat className="animate-bounce" size={18} /> : <ChefHat size={18} />}
                  AI Generate Plan
               </button>
            </div>
         </header>

         <div className="grid gap-6">
            {(mealPlans.length > 0 ? mealPlans : [
               { day: 'Monday', breakfast: '...', lunch: '...', dinner: '...', snacks: [] }
            ]).map((plan, i) => (
               <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-blue-50 soft-shadow grid grid-cols-1 md:grid-cols-4 gap-6 hover:border-blue-200 transition-colors">
                  <div className="md:col-span-1 flex flex-col justify-center border-r border-slate-50 pr-6">
                     <h3 className="text-2xl font-bold text-slate-900">{plan.day}</h3>
                     <p className="text-sm text-slate-400 font-medium">3 meals • 2 snacks</p>
                  </div>
                  <div className="space-y-2">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Coffee size={12}/> Breakfast</span>
                     <p className="font-bold text-slate-700">{plan.breakfast}</p>
                  </div>
                  <div className="space-y-2">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><UtensilsIcon size={12}/> Lunch</span>
                     <p className="font-bold text-slate-700">{plan.lunch}</p>
                  </div>
                  <div className="space-y-2">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><ChefHat size={12}/> Dinner</span>
                     <p className="font-bold text-slate-700">{plan.dinner}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
    );
  };

  const SafetyView = () => {
    return (
       <div className="space-y-8 fade-in-view max-w-6xl mx-auto">
         <header className="flex justify-between items-end">
            <div>
               <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Guardian Eye</h2>
               <h1 className="text-4xl font-bold text-slate-900">Safety Center</h1>
            </div>
            <button className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-red-700 animate-pulse ring-4 ring-red-100">
               <AlertTriangle size={18} fill="white" /> SOS EMERGENCY
            </button>
         </header>

         <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-slate-100 rounded-[2.5rem] h-[500px] w-full relative overflow-hidden group shadow-inner border border-slate-200">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Neighborhood_Map.jpg')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                  
                  {/* Pins */}
                  <div className="absolute top-1/3 left-1/4 flex flex-col items-center gap-2 animate-bounce">
                     <div className="w-12 h-12 rounded-full border-4 border-white shadow-xl overflow-hidden">
                        <img src={children[0].avatar} className="w-full h-full object-cover" />
                     </div>
                     <div className="px-3 py-1 bg-white rounded-lg shadow-md text-xs font-bold text-slate-800 border border-slate-100">Aryan: School</div>
                  </div>
                  
                  <div className="absolute top-1/2 right-1/3 flex flex-col items-center gap-2">
                     <div className="w-12 h-12 rounded-full border-4 border-white shadow-xl overflow-hidden">
                        <img src={children[1].avatar} className="w-full h-full object-cover" />
                     </div>
                     <div className="px-3 py-1 bg-white rounded-lg shadow-md text-xs font-bold text-slate-800 border border-slate-100">Zoya: Home</div>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                     <button className="p-3 bg-white rounded-xl shadow-lg text-slate-700 hover:text-blue-600"><MapIcon size={24}/></button>
                     <button className="p-3 bg-white rounded-xl shadow-lg text-slate-700 hover:text-blue-600"><Target size={24}/></button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[2rem] border border-blue-50 soft-shadow flex items-center justify-between">
                     <div>
                        <h4 className="font-bold text-slate-900">Screen Time</h4>
                        <p className="text-xs text-slate-400">Today's Avg: 1h 45m</p>
                     </div>
                     <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Smartphone size={24}/></div>
                  </div>
                  <div className="bg-white p-6 rounded-[2rem] border border-blue-50 soft-shadow flex items-center justify-between">
                     <div>
                        <h4 className="font-bold text-slate-900">Content Filter</h4>
                        <p className="text-xs text-emerald-500 font-bold">Active & Secure</p>
                     </div>
                     <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><Shield size={24}/></div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 soft-shadow">
                  <h3 className="font-bold text-lg text-slate-900 mb-6">Recent Alerts</h3>
                  <div className="space-y-4">
                     {safetyAlerts.map(alert => (
                        <div key={alert.id} className="flex gap-4 items-start">
                           <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${alert.severity === 'high' ? 'bg-red-500' : alert.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                           <div>
                              <p className="text-sm font-bold text-slate-800 leading-tight">{alert.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{alert.timestamp}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="bg-white p-8 rounded-[2.5rem] border border-blue-50 soft-shadow">
                  <h3 className="font-bold text-lg text-slate-900 mb-6">Geofences</h3>
                  <div className="space-y-3">
                     {['Home', 'School', 'Grandmas House'].map(zone => (
                        <div key={zone} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-50">
                           <span className="font-bold text-sm text-slate-700">{zone}</span>
                           <span className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="bg-red-50 p-6 rounded-[2.5rem] border border-red-100">
                  <h3 className="font-bold text-red-900 mb-2">Emergency Contacts</h3>
                  <div className="flex gap-2">
                     <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold">911</div>
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 font-bold border border-red-100">Dad</div>
                     <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-red-100 hover:text-red-500"><PlusCircle size={20}/></button>
                  </div>
               </div>
            </div>
         </div>
       </div>
    );
  };

  const ResourcesView = () => {
    return (
       <div className="space-y-8 fade-in-view max-w-6xl mx-auto">
         <header className="flex justify-between items-end">
            <div>
               <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Parenting Wisdom</h2>
               <h1 className="text-4xl font-bold text-slate-900">Resources</h1>
            </div>
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input type="text" placeholder="Search topics..." className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-64 focus:border-blue-500 outline-none transition-colors font-medium text-slate-600" />
            </div>
         </header>

         <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {['All', 'Education', 'Health', 'Psychology', 'Activities'].map(cat => (
               <button key={cat} className="px-6 py-2 bg-white border border-blue-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors whitespace-nowrap">
                  {cat}
               </button>
            ))}
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map(res => (
               <div key={res.id} className="bg-white rounded-[2.5rem] border border-blue-50 soft-shadow overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  <div className="h-48 overflow-hidden">
                     <img src={res.image} alt={res.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-8 space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">{res.category}</span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock size={12}/> {res.readTime}</span>
                     </div>
                     <h3 className="font-bold text-xl text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{res.title}</h3>
                     <p className="text-sm text-slate-500 leading-relaxed">{res.summary}</p>
                     <button className="text-blue-600 font-bold text-sm flex items-center gap-2 mt-2">Read Article <ArrowRight size={16}/></button>
                  </div>
               </div>
            ))}
            
            {/* AI Custom Article Card */}
            <div className="sapphire-gradient rounded-[2.5rem] p-8 text-white flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden shadow-xl">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Bot size={32} />
               </div>
               <h3 className="font-bold text-2xl relative z-10">Need specific advice?</h3>
               <p className="text-blue-100 font-medium max-w-xs relative z-10">Ask our AI for a custom guide tailored to your exact situation.</p>
               <button onClick={() => setView('support')} className="px-8 py-3 bg-white text-blue-700 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all relative z-10">
                  Ask Parent Ease
               </button>
            </div>
         </div>
       </div>
    );
  };

  const DashboardView = () => (
    <div className="space-y-10 fade-in-view max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Morning Overview</h2>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight">Hello, {parentName}!</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">You are rocking it as a {parentType}. Your family schedule is fully optimized for today.</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-[2rem] soft-shadow border border-blue-50 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Wallet size={20}/></div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Budget Left</p>
            <p className="text-xl font-bold text-blue-600">₹ 24,500</p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-slate-800">Your Children</h3>
          <button className="text-blue-600 text-sm font-bold hover:underline" onClick={() => setView('child-profile')}>View Profiles</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map(child => (
            <div 
              key={child.id}
              onClick={() => { setActiveChildId(child.id); setView('child-profile'); }}
              className="bg-white p-6 rounded-[2.5rem] soft-shadow border border-blue-50 flex items-center gap-6 cursor-pointer hover:border-blue-300 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blue-50 ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform">
                <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600">{child.name}</h4>
                <p className="text-sm text-slate-400 font-medium">Grade {child.grade} • {child.age} Yrs</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={24} />
            </div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="sapphire-gradient p-8 rounded-[2.5rem] text-white shadow-xl flex items-center gap-8 overflow-hidden relative">
            <div className="absolute right-0 top-0 p-4 opacity-10 rotate-12"><BrainCircuit size={180} /></div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-bold">AI Insight</h3>
              <p className="text-blue-50 text-lg opacity-90 leading-relaxed max-w-md font-medium">"Based on Aryan's math progress, he might need 15 mins of spatial geometry review tonight at 6 PM. Shall I schedule it?"</p>
              <div className="flex gap-3">
                <button className="px-8 py-2.5 bg-white text-blue-700 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">Agree</button>
                <button className="px-8 py-2.5 bg-blue-500/20 text-white border border-white/20 rounded-xl font-bold text-sm">Maybe Later</button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-blue-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-slate-800">Priority Tasks</h3>
              <button onClick={() => setView('tasks')} className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">Full List</button>
            </div>
            <div className="space-y-3">
              {tasks.slice(0, 3).map(t => (
                <div key={t.id} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:border-blue-100 transition-all">
                  <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm ${t.completed ? 'text-emerald-500' : 'text-blue-500'}`}><CheckCircle2 size={24}/></div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm text-slate-800 ${t.completed ? 'line-through opacity-50' : ''}`}>{t.title}</p>
                    <p className="text-xs text-slate-400 font-medium">Assigned to {t.assignee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-blue-50 text-center">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-slate-800">Quick Actions</h3>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setView('tasks')} className="p-6 bg-blue-50 rounded-2xl flex flex-col items-center gap-2 group hover:bg-blue-600 transition-all">
                 <PlusCircle className="text-blue-600 group-hover:text-white" />
                 <span className="text-[10px] font-bold text-blue-900 group-hover:text-white uppercase tracking-widest">Add Task</span>
               </button>
               <button onClick={() => setView('meals')} className="p-6 bg-slate-50 rounded-2xl flex flex-col items-center gap-2 group hover:bg-blue-600 transition-all">
                 <ChefHat className="text-slate-400 group-hover:text-white" />
                 <span className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-widest">Plan Meal</span>
               </button>
             </div>
             <button onClick={() => setView('safety')} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-slate-800">
                <Shield size={16} /> Safety Check
             </button>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 text-center space-y-4">
             <MapPin className="mx-auto text-blue-600" size={32} />
             <h4 className="font-bold text-blue-900">Safety Status</h4>
             <p className="text-xs text-blue-700 font-medium opacity-80 leading-relaxed">Aryan is currently in the Science Lab at St. Paul's.</p>
             <button onClick={() => setView('safety')} className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold text-xs shadow-sm uppercase tracking-widest hover:bg-blue-100">Live Track</button>
          </div>
        </div>
      </div>
    </div>
  );

  const ChildProfileView = () => (
    <div className="space-y-10 fade-in-view max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-blue-100 ring-4 ring-white shadow-xl">
            <img src={activeChild.avatar} alt={activeChild.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Family Member</h2>
            <h1 className="text-4xl font-bold text-slate-900">{activeChild.name}</h1>
            <p className="text-slate-400 font-medium">Grade {activeChild.grade} • {activeChild.age} Years Old</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-4 bg-white border border-blue-50 rounded-2xl text-slate-400 hover:text-blue-600 soft-shadow transition-all"><Edit3 size={20}/></button>
          <button className="p-4 bg-white border border-blue-50 rounded-2xl text-slate-400 hover:text-red-600 soft-shadow transition-all"><Trash2 size={20}/></button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-blue-50">
            <h3 className="font-bold text-xl mb-6 text-slate-800">Today's Activities</h3>
            <div className="space-y-4">
              {activeChild.activities.length > 0 ? (
                activeChild.activities.map(activity => (
                  <div key={activity.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className={`p-4 rounded-xl ${activity.type === 'school' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      <CalendarIcon size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-slate-900">{activity.title}</p>
                      <p className="text-sm text-slate-400 font-medium">{activity.time} • {activity.location}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-100">{activity.type}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic text-center py-8">No activities scheduled for today.</p>
              )}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-blue-50">
            <h3 className="font-bold text-xl mb-6 text-slate-800">Development Milestones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Physical', 'Cognitive', 'Social', 'Academic'].map(cat => (
                <div key={cat} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat}</span>
                    <TrendingUp size={16} className="text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="sapphire-gradient p-8 rounded-[2.5rem] text-white shadow-xl space-y-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-bold">AI Growth Tip</h3>
            <p className="text-blue-50 font-medium opacity-90 leading-relaxed">
              {activeChild.name} is showing great progress in {activeChild.activities[0]?.title || 'daily tasks'}. 
              Consider rewarding this consistency with an extra story time tonight.
            </p>
            <button className="w-full py-4 bg-white text-blue-700 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
              View Detailed Analytics
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-blue-50 text-center space-y-4">
            <Smile className="mx-auto text-blue-400" size={32} />
            <h4 className="font-bold text-slate-800">Emotional Well-being</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Stable & Positive based on last 7 days check-ins.</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i === 4 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-400'}`}>
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BudgetView = () => {
    const [advice, setAdvice] = useState<string>('');
    const [loadingAdvice, setLoadingAdvice] = useState(false);

    const handleGetAdvice = async () => {
      setLoadingAdvice(true);
      try {
        const res = await getBudgetAdvice(expenses);
        setAdvice(res || '');
      } catch (error) {
        setAdvice("Advice currently unavailable from the AI link.");
      } finally {
        setLoadingAdvice(false);
      }
    };

    return (
      <div className="space-y-10 fade-in-view max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-blue-500 font-bold text-[10px] uppercase tracking-widest mb-1">Financial Portal</h2>
            <h1 className="text-4xl font-bold text-slate-900">Budgeting</h1>
          </div>
          <button 
            onClick={handleGetAdvice}
            className="px-8 py-4 sapphire-gradient text-white rounded-[1.5rem] font-bold shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
            disabled={loadingAdvice}
          >
            {loadingAdvice ? (
              <Zap className="animate-pulse" size={20} />
            ) : (
              <TrendingUp size={20}/>
            )}
            <span className="text-sm">Get AI Advice</span>
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-blue-50">
              <h3 className="font-bold text-xl mb-6 text-slate-800">Recent Expenses</h3>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                        <Wallet size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{expense.title}</p>
                        <p className="text-xs text-slate-400 font-medium">{expense.date} • {expense.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹ {expense.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {advice && (
              <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-4 mb-4">
                  <Bot className="text-indigo-600" size={24} />
                  <h3 className="font-bold text-xl text-indigo-900">AI Financial Analysis</h3>
                </div>
                <div className="prose prose-indigo max-w-none text-slate-700">
                  <p>{advice}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] soft-shadow border border-blue-50">
              <h3 className="font-bold text-xl mb-6 text-slate-800">Budget Summary</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                    <span>Spent</span>
                    <span>₹ 20,700</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[45%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                     <span>Remaining</span>
                     <span>₹ 24,500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                       <TrendingDown size={16} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">On track for month end</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl text-center">
               <PiggyBank className="mx-auto mb-4 text-yellow-400" size={40} />
               <h3 className="font-bold text-xl mb-2">Savings Goal</h3>
               <p className="text-slate-400 text-sm mb-6">Family Summer Trip</p>
               <div className="w-full h-32 rounded-2xl bg-slate-800 flex items-end justify-center pb-4 relative overflow-hidden group">
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-600 to-transparent opacity-20 h-full group-hover:h-[80%] transition-all duration-700"></div>
                  <span className="relative z-10 font-bold text-3xl">45%</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SignInView = () => (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F4F9FF] relative overflow-hidden">
       {/* Background decorative elements */}
       <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
       <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

       <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white p-8 md:p-12 fade-in-view">
          <div className="text-center mb-10">
             <div className="w-16 h-16 sapphire-gradient rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 text-white transform rotate-3">
                <Heart size={32} fill="white" />
             </div>
             <h1 className="text-3xl font-bold text-slate-900 mb-2 font-['Outfit']">Welcome Back</h1>
             <p className="text-slate-500 font-medium">Enter your details to access your family dashboard.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setView('dashboard'); }}>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                   <input type="email" placeholder="sarah@example.com" defaultValue="sarah@parentease.ai" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all outline-none font-medium text-slate-700" />
                </div>
             </div>
             
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative group">
                   <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                   <input type="password" placeholder="••••••••" defaultValue="password123" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all outline-none font-medium text-slate-700" />
                </div>
             </div>

             <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                   <span className="text-slate-500 font-medium">Remember me</span>
                </label>
                <button type="button" className="text-blue-600 font-bold hover:underline">Forgot Password?</button>
             </div>

             <button type="submit" className="w-full py-4 sapphire-gradient text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span>Sign In</span>
                <ArrowRight size={20} />
             </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-slate-500 font-medium">Don't have an account? <button onClick={() => setView('landing')} className="text-blue-600 font-bold hover:underline">Sign Up</button></p>
          </div>
       </div>
    </div>
  );

  const LandingView = () => (
    <div className="min-h-screen bg-[#F4F9FF]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="p-2 sapphire-gradient rounded-xl text-white shadow-lg"><Heart size={24} fill="white" /></div>
            <span className="font-bold text-xl text-blue-900 font-['Outfit']">Parent Ease</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
             <button onClick={() => setView('about')} className="text-slate-500 font-bold hover:text-blue-600">Features</button>
             <button onClick={() => setView('pricing')} className="text-slate-500 font-bold hover:text-blue-600">Pricing</button>
             <button onClick={() => setView('about')} className="text-slate-500 font-bold hover:text-blue-600">About</button>
             <button onClick={() => setView('contact')} className="text-slate-500 font-bold hover:text-blue-600">Contact</button>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setView('sign-in')} className="px-6 py-2 text-slate-600 font-bold hover:text-blue-600 transition-colors">Log In</button>
            <button onClick={() => setView('sign-in')} className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">Get Started</button>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight font-['Outfit']">
              Parenting, <br/>
              <span className="text-transparent bg-clip-text sapphire-gradient">Simplified.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
              The all-in-one AI assistant that harmonizes your family's schedule, development, and well-being.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setView('sign-in')} className="px-8 py-4 sapphire-gradient text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                Start Free Trial <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Play size={20} fill="currentColor" className="text-slate-900" /> Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-600">Trusted by 10,000+ parents</p>
            </div>
          </div>
          <div className="relative animate-in slide-in-from-right duration-700">
             <div className="absolute inset-0 bg-blue-600 rounded-full filter blur-[100px] opacity-10"></div>
             <img src="https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?auto=format&fit=crop&q=80&w=1000" alt="Happy Parent" className="relative z-10 rounded-[3rem] shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500" />
             
             {/* Floating Cards */}
             <div className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-xl z-20 animate-bounce delay-700">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 size={20} /></div>
                   <div>
                      <p className="text-xs text-slate-400 font-bold">Task Completed</p>
                      <p className="text-sm font-bold text-slate-900">Pickup Groceries</p>
                   </div>
                </div>
             </div>
             
             <div className="absolute bottom-10 -right-5 bg-white p-4 rounded-2xl shadow-xl z-20 animate-bounce">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Bot size={20} /></div>
                   <div>
                      <p className="text-xs text-slate-400 font-bold">AI Suggestion</p>
                      <p className="text-sm font-bold text-slate-900">Bedtime Story: 8 PM</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GenericPlaceholder = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="fade-in-view max-w-5xl mx-auto text-center py-20">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
        <Icon size={48} />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">This module is currently being calibrated by our sapphire AI engine. Check back soon for updates.</p>
      <button onClick={() => setView('dashboard')} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors">
        Return to Dashboard
      </button>
    </div>
  );

  const UtensilsIcon = ({size}: {size: number}) => (
     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-[#F4F9FF] font-sans text-slate-900 selection:bg-blue-100">
      {view === 'landing' ? (
        <LandingView />
      ) : view === 'sign-in' ? (
        <SignInView />
      ) : (
        <div className="flex">
          <SideMenu />
          
          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[105] bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          )}
          {isMobileMenuOpen && (
            <div className="fixed inset-y-0 left-0 z-[110] w-full max-w-sm bg-white shadow-2xl lg:hidden animate-in slide-in-from-left">
               <SideMenu isMobile={true} />
            </div>
          )}

          <main className="flex-1 min-w-0 lg:ml-72 transition-all duration-300 flex flex-col min-h-screen">
            <TopBar />
            <div className="flex-1 p-4 md:p-8">
              {view === 'dashboard' && <DashboardView />}
              {view === 'child-profile' && <ChildProfileView />}
              {view === 'budgeting' && <BudgetView />}
              {view === 'schedule' && <ScheduleView />}
              {view === 'tasks' && <TasksView />}
              {view === 'meals' && <MealsView />}
              {view === 'safety' && <SafetyView />}
              {view === 'resources' && <ResourcesView />}
              {view === 'home-iot' && <SmartHomeView />}
              {view === 'community' && <CommunityView />}
              {view === 'settings' && <SettingsView />}
              {view === 'help' && <HelpView />}
              
              {/* Support/Chat View */}
              {view === 'support' && (
                 <div className="max-w-3xl mx-auto h-[80vh] flex flex-col bg-white rounded-[2.5rem] soft-shadow border border-blue-50 overflow-hidden fade-in-view">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                       <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Bot size={24}/></div>
                       <div>
                          <h3 className="font-bold text-slate-900">Parent Ease AI</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online</p>
                       </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                       {chatHistory.map((msg, idx) => (
                          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[80%] p-4 rounded-2xl ${
                                msg.role === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-slate-100 text-slate-700 rounded-bl-none'
                             }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                             </div>
                          </div>
                       ))}
                       {loading && (
                          <div className="flex justify-start">
                             <div className="bg-slate-100 p-4 rounded-2xl rounded-bl-none flex gap-2">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                             </div>
                          </div>
                       )}
                       <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100">
                       <div className="relative">
                          <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask for advice, schedule help, or meal ideas..." 
                            className="w-full pl-6 pr-14 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all outline-none font-medium text-slate-700"
                          />
                          <button onClick={handleSendMessage} disabled={!chatInput.trim() || loading} className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                             <Send size={20} />
                          </button>
                       </div>
                    </div>
                 </div>
              )}

              {/* Catch-all for other generic pages */}
              {(view === 'about' || view === 'contact' || view === 'pricing') && (
                 <GenericPlaceholder title={view.charAt(0).toUpperCase() + view.slice(1)} icon={Info} />
              )}
            </div>
            <Footer />
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
