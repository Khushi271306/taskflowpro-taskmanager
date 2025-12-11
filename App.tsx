
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Layout, Bell, CheckCircle2, ListTodo, Search, Filter } from 'lucide-react';
import { Task } from './types';
import TaskItem from './components/TaskItem';
import ReminderModal from './components/ReminderModal';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isReminderNeeded, setIsReminderNeeded] = useState(false);
  const [activeReminder, setActiveReminder] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persistence logic
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Reminder Checker Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const twoMinutesInMs = 2 * 60 * 1000;

      tasks.forEach((task) => {
        if (
          task.dueDate && 
          task.reminderEnabled && 
          !task.reminderShown && 
          !task.completed
        ) {
          const taskTime = new Date(task.dueDate).getTime();
          const timeUntilTask = taskTime - now;

          // If task is within 2 minutes and hasn't passed yet
          if (timeUntilTask > 0 && timeUntilTask <= twoMinutesInMs) {
            setActiveReminder(task);
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, reminderShown: true } : t));
          }
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle.trim(),
      dueDate: dueDate || undefined,
      completed: false,
      reminderEnabled: isReminderNeeded,
      reminderShown: false,
      createdAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    setTaskTitle('');
    setDueDate('');
    setIsReminderNeeded(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, searchQuery]);

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed
    };
  }, [tasks]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center">
      {/* Dynamic Professional Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      </div>

      {/* Main UI Wrapper */}
      <main className="relative z-10 w-full max-w-4xl px-4 py-8 md:py-12 flex flex-col gap-8 h-full">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="font-montserrat text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
              TASK MANAGER
            </h1>
            <p className="text-indigo-600 font-medium tracking-wide uppercase text-xs md:text-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              Keep your day organized and efficient
            </p>
          </div>
          
          <div className="hidden md:flex gap-6">
            <div className="text-right">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active</p>
              <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Done</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
          </div>
        </header>

        {/* Input Area Card */}
        <section className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white/50">
          <form onSubmit={handleAddTask} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full h-14 bg-slate-50 border-0 rounded-2xl px-6 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
              
              <div className="flex-shrink-0 flex gap-2">
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-14 bg-slate-50 border-0 rounded-2xl px-4 text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium cursor-pointer"
                />
                <button
                  type="submit"
                  className="h-14 w-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center transition-all active:scale-90"
                >
                  <Plus size={28} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isReminderNeeded}
                    onChange={(e) => setIsReminderNeeded(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                  <Bell size={16} />
                  Enable Reminder?
                </span>
              </label>
            </div>
          </form>
        </section>

        {/* Task List Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-slate-800">
              <ListTodo size={20} className="text-indigo-600" />
              <h2 className="text-lg font-bold">Today's Focus</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/50 border-none rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 transition-all w-48"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-[300px]">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                <div className="p-6 bg-white/40 rounded-full border border-white/40">
                  <Layout size={40} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-500">No tasks found</p>
                  <p className="text-sm opacity-70">Add a new task to get started on Flow</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer Info */}
        <footer className="mt-auto py-8 text-center">
          <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">
            Designed for Performance & Simplicity
          </p>
        </footer>
      </main>

      {/* Pop-up Reminder Overlay */}
      {activeReminder && (
        <ReminderModal 
          task={activeReminder} 
          onClose={() => setActiveReminder(null)} 
        />
      )}
    </div>
  );
};

export default App;
