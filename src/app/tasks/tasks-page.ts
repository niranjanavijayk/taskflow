import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../core/task.service';
import { StatusFilter } from '../core/task.model';
import { TaskList } from './task-list';
import { TaskDetails } from './task-details';

@Component({
  selector: 'app-tasks-page',
  imports: [TaskList, TaskDetails],
  template: `
    <div class="split">
      <app-task-list [q]="q()" [status]="status()" [selectedId]="selectedId()"
        (qChange)="setParam('q', $event)" (statusChange)="setParam('status', $event)"
        (picked)="selectedId.set($event)" />
      <app-task-details [task]="selected()" />
    </div>
  `,
})
export class TasksPage {
  private readonly router = inject(Router);
  private readonly svc = inject(TaskService);

  // URL state: bound from ?q= and ?status= (withComponentInputBinding)
  readonly q = input('', { transform: (v: string | undefined) => v ?? '' });
  readonly status = input<StatusFilter, string | undefined>('all', {
    transform: v => (v === 'open' || v === 'done' ? v : 'all'),
  });

  // Local UI state shared by two siblings, so it lives in their parent
  protected readonly selectedId = signal<number | null>(null);
  protected readonly selected = computed(() => this.svc.tasks().find(t => t.id === this.selectedId()) ?? null);

  protected setParam(key: 'q' | 'status', value: string): void {
    const clean = value === '' || value === 'all' ? null : value;
    this.router.navigate([], { queryParams: { [key]: clean }, queryParamsHandling: 'merge', replaceUrl: true });
  }
}
