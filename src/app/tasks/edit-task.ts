import { Component, computed, inject, input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CanDeactivateFn, Router, RouterLink } from '@angular/router';
import { TaskService } from '../core/task.service';
import { Status } from '../core/task.model';

@Component({
  selector: 'app-edit-task',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="panel narrow">
      <h2>Edit task</h2>
      @if (loading()) {
        <p class="note">Loading task…</p>
      } @else if (task()) {
        <form [formGroup]="form" (ngSubmit)="save()">
          <label>Title
            <input formControlName="title" />
          </label>
          @if (form.controls.title.touched && form.controls.title.invalid) {
            <p class="error">Title is required (at least 3 characters).</p>
          }
          <label>Due date
            <input type="date" formControlName="dueDate" />
          </label>
          <label>Status
            <select formControlName="status">
              <option value="open">Open</option>
              <option value="done">Done</option>
            </select>
          </label>
          <div class="actions">
            <button class="primary" type="submit" [disabled]="form.invalid">Save changes</button>
            <a class="btn" routerLink="/tasks">Back to tasks</a>
          </div>
        </form>
      } @else {
        <p class="note">Task not found.</p>
      }
    </section>
  `,
})
export class EditTask implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly svc = inject(TaskService);
  private readonly router = inject(Router);

  readonly id = input.required<string>(); // URL state: :id

  protected readonly loading = this.svc.loading;
  protected readonly task = computed(() => this.svc.tasks().find(t => t.id === Number(this.id())));

  // Form state (values, dirty, valid) is owned by the FormGroup, no extra signals
  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    dueDate: ['', Validators.required],
    status: ['open' as Status],
  });

  async ngOnInit(): Promise<void> {
    await this.svc.load();
    const t = this.task();
    if (t) this.form.reset({ title: t.title, dueDate: t.dueDate, status: t.status }); // reset() leaves it pristine
  }

  protected save(): void {
    if (this.form.invalid) return;
    this.svc.update(Number(this.id()), this.form.getRawValue());
    this.form.markAsPristine();
    this.router.navigate(['/tasks']);
  }
}

export const unsavedChangesGuard: CanDeactivateFn<EditTask> = c =>
  !c.form.dirty || confirm('You have unsaved changes. Leave without saving?');
