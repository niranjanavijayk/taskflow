import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isOverdue, TaskService } from '../core/task.service';
import { Task } from '../core/task.model';

@Component({
  selector: 'app-task-details',
  imports: [RouterLink],
  template: `
    <aside class="panel" aria-label="Task details">
      @if (task(); as t) {
        <h2>{{ t.title }}</h2>
        <p>{{ t.description }}</p>
        <dl>
          <dt>Due</dt><dd>{{ t.dueDate }}</dd>
          <dt>Status</dt>
          <dd>{{ t.status }} @if (overdue(t)) { <span class="tag late">Overdue</span> }</dd>
        </dl>
        <div class="actions">
          <button class="primary" [disabled]="t.status === 'done'" (click)="svc.markDone(t.id)">Mark as done</button>
          <a class="btn" [routerLink]="['/tasks', t.id, 'edit']">Edit task</a>
        </div>
      } @else {
        <p class="note">Select a task from the list to see its details.</p>
      }
    </aside>
  `,
})
export class TaskDetails {
  protected readonly svc = inject(TaskService);
  readonly task = input<Task | null>(null);
  protected readonly overdue = isOverdue;
}
