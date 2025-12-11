
import React from 'react';
import { Check, Trash2, Calendar, Bell, BellOff } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border border-white/20 bg-white/40 backdrop-blur-md hover:bg-white/60 hover:shadow-lg ${task.completed ? 'opacity-60' : ''}`}>
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.completed 
            ? 'bg-emerald-500 border-emerald-500 text-white' 
            : 'border-slate-300 hover:border-indigo-500'
        }`}
      >
        {task.completed && <Check size={14} strokeWidth={3} />}
      </button>

      <div className="flex-grow min-w-0">
        <h3 className={`text-slate-800 font-medium truncate ${task.completed ? 'line-through text-slate-500' : ''}`}>
          {task.title}
        </h3>
        
        <div className="flex flex-wrap gap-3 mt-1">
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs font-medium ${isOverdue ? 'text-rose-500' : 'text-slate-500'}`}>
              <Calendar size={12} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          {task.reminderEnabled && !task.completed && (
            <div className="flex items-center gap-1 text-xs font-medium text-indigo-500">
              <Bell size={12} />
              <span>Reminder set</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 text-slate-400 hover:text-rose-500 p-2 rounded-lg hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TaskItem;
