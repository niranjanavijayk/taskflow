import { Injectable, computed, signal } from '@angular/core';
import { Task } from './task.model';

const iso = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

/** A task is overdue when it is still open and its due date is before today. */
export const isOverdue = (t: Task): boolean => t.status === 'open' && t.dueDate < iso(0);

const seed = (): Task[] => [
  { id: 1, title: 'Prepare sprint demo', description: 'Slides and a live walkthrough for Friday.', dueDate: iso(-3), status: 'open' },
  { id: 2, title: 'Fix login redirect bug', description: 'Users land on a blank page after OAuth.', dueDate: iso(-1), status: 'open' },
  { id: 3, title: 'Write API documentation', description: 'Document the tasks endpoints with examples.', dueDate: iso(2), status: 'open' },
  { id: 4, title: 'Review pull request #42', description: 'Check naming and state handling.', dueDate: iso(0), status: 'open' },
  { id: 5, title: 'Update onboarding checklist', description: 'Add the new laptop setup steps.', dueDate: iso(-6), status: 'done' },
  { id: 6, title: 'Plan team retrospective', description: 'Collect topics and book a room.', dueDate: iso(5), status: 'open' },
  { id: 7, title: 'Upgrade to Angular 21', description: 'Run the update schematics and fix warnings.', dueDate: iso(-2), status: 'open' },
  { id: 8, title: 'Design settings page', description: 'Wireframe the profile section.', dueDate: iso(7), status: 'done' },
  { id: 9, title: 'Clean up unused styles', description: 'Remove dead CSS from the dashboard.', dueDate: iso(10), status: 'open' },
  { id: 10, title: 'Send weekly status email', description: 'Summarise progress for the stakeholders.', dueDate: iso(-4), status: 'done' },
];

/** Server state: the app's copy of the task list. Only this service can change it. */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal(true);
  private pending?: Promise<void>;

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  /** Derived, never stored. */
  readonly overdueCount = computed(() => this._tasks().filter(isOverdue).length);

  /** Fetches once; later calls reuse the same promise (cache). */
  load(): Promise<void> {
    return (this.pending ??= this.fetch());
  }

  markDone(id: number): void {
    this.update(id, { status: 'done' });
  }

  update(id: number, patch: Partial<Omit<Task, 'id'>>): void {
    this._tasks.update(list => list.map(t => (t.id === id ? { ...t, ...patch } : t)));
  }

  private async fetch(): Promise<void> {
    this._loading.set(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // fake API delay
    this._tasks.set(seed());
    this._loading.set(false);
  }
}
