import { Component, computed, inject, input, output, signal } from '@angular/core';
import { isOverdue, TaskService } from '../core/task.service';
import { StatusFilter } from '../core/task.model';

@Component({
  selector: 'app-task-list',
  template: `
    <section class="panel" aria-label="Task list">
      <div class="controls">
        <input type="search" placeholder="Search tasks" aria-label="Search tasks"
               [value]="q()" (input)="qChange.emit($any($event.target).value)" />
        <label class="toggle">
          <input type="checkbox" [checked]="compact()" (change)="compact.set(!compact())" /> Compact view
        </label>
      </div>
      <div class="tabs" role="tablist">
        @for (t of tabs; track t) {
          <button role="tab" [attr.aria-selected]="status() === t" [class.active]="status() === t"
                  (click)="statusChange.emit(t)">{{ t }}</button>
        }
      </div>

      @if (loading()) {
        <p class="note">Loading tasks…</p>
      } @else {
        <ul class="rows" [class.compact]="compact()">
          @for (t of visible(); track t.id) {
            <li>
              <button class="row" [class.selected]="t.id === selectedId()" (click)="picked.emit(t.id)">
                <span class="title">{{ t.title }}</span>
                <span class="meta">
                  @if (overdue(t)) { <span class="tag late">Overdue</span> }
                  <span class="tag" [class.ok]="t.status === 'done'">{{ t.status }}</span>
                  <span class="due">{{ t.dueDate }}</span>
                </span>
              </button>
            </li>
          } @empty {
            <li class="note">No tasks match your filters.</li>
          }
        </ul>
      }
    </section>
  `,
})
export class TaskList {
  private readonly svc = inject(TaskService);

  readonly q = input.required<string>();
  readonly status = input.required<StatusFilter>();
  readonly selectedId = input<number | null>(null);
  readonly qChange = output<string>();
  readonly statusChange = output<StatusFilter>();
  readonly picked = output<number>();

  protected readonly tabs: StatusFilter[] = ['all', 'open', 'done'];
  protected readonly loading = this.svc.loading;
  protected readonly compact = signal(false); // Local UI
  protected readonly overdue = isOverdue;

  protected readonly visible = computed(() => {
    const q = this.q().trim().toLowerCase();
    const s = this.status();
    return this.svc.tasks().filter(t => (s === 'all' || t.status === s) && t.title.toLowerCase().includes(q));
  });
}
