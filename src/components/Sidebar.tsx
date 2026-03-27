
import React from 'react';
import { 
  Home, 
  Calendar, 
  ClipboardList, 
  ChefHat, 
  Shield, 
  User, 
  Wallet, 
  Monitor, 
  Users, 
  BookOpen, 
  Bot, 
  Settings, 
  HelpCircle,
  Heart,
  LogOut
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'schedule', label: 'Scheduler', icon: Calendar },
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
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Heart size={24} fill="white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Parent Ease</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl cursor-pointer transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
