export type Status = 'open' | 'done';
export type StatusFilter = Status | 'all';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string; // yyyy-mm-dd
  status: Status;
}
