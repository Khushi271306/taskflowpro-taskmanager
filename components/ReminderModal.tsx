
import React from 'react';
import { Bell, X, CheckCircle } from 'lucide-react';
import { Task } from '../types';

interface ReminderModalProps {
  task: Task;
  onClose: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ task, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-indigo-600 p-6 flex flex-col items-center text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="bg-white/20 p-4 rounded-full mb-4">
            <Bell size={32} className="animate-bounce" />
          </div>
          <h2 className="text-xl font-bold">Upcoming Task!</h2>
          <p className="text-indigo-100 text-sm mt-1">Due in less than 2 minutes</p>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Task Detail</p>
          <h3 className="text-slate-800 text-lg font-semibold mb-6">{task.title}</h3>
          
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
