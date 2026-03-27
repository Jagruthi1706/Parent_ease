
import React from 'react';
import { 
  Bell, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Plus, 
  Shield, 
  TrendingUp 
} from 'lucide-react';
import { Child, Task } from '../types';

interface DashboardProps {
  children: Child[];
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ children, tasks }) => {
  const pendingTasks = tasks.filter(t => !t.completed);
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Sarah</h1>
          <p className="text-slate-500 mt-1">Here's what's happening in your family today.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:bg-slate-50 transition-colors">
            <Bell size={20} />
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
            <Plus size={18} />
            Add New
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-green-500 text-sm font-semibold">+12%</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Tasks Completed</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">24 / 30</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-purple-500 text-sm font-semibold">Good</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Development Score</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">88 / 100</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <span className="text-orange-500 text-sm font-semibold">Busy</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Scheduled Today</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">8 Events</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Shield size={24} />
            </div>
            <span className="text-emerald-500 text-sm font-semibold">Active</span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Safety Alert Status</h3>
          <p className="text-2xl font-bold text-slate-900 mt-1">All Safe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Upcoming Activities</h2>
              <button className="text-blue-600 text-sm font-semibold hover:underline flex items-center">
                View Calendar <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {children.flatMap(c => c.activities).slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className={`p-3 rounded-xl ${activity.type === 'school' ? 'bg-indigo-100 text-indigo-600' : activity.type === 'extra' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                    <CalendarIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{activity.title}</h4>
                    <p className="text-sm text-slate-500">{activity.time}</p>
                  </div>
                  <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-400 border border-slate-100">
                    {activity.type.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Insights Card */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">AI Parent Tip of the Day</h2>
              <p className="text-blue-100 mb-6 max-w-md">Based on Liam's recent math progress, try introducing spatial reasoning games tonight. It can boost his confidence before the quiz on Friday.</p>
              <button className="bg-white text-blue-600 px-6 py-2.5 rounded-full font-bold hover:bg-blue-50 transition-colors">
                Try Activity
              </button>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-10 -translate-y-10 scale-150">
              <TrendingUp size={160} />
            </div>
          </section>
        </div>

        {/* Pending Tasks */}
        <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Task List</h2>
            <button className="text-slate-400 hover:text-slate-600">
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-3">
            {pendingTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 border border-slate-50 rounded-xl hover:bg-slate-50 transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                  <p className="text-xs text-slate-400">{task.dueDate}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-orange-400' : 'bg-slate-300'}`} />
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-slate-500 font-medium text-sm hover:bg-slate-50 rounded-xl transition-colors">
            Show all {pendingTasks.length} tasks
          </button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
