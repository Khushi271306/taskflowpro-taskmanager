
export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
  reminderEnabled: boolean;
  reminderShown: boolean;
  createdAt: number;
}

export type Theme = 'light' | 'dark';
