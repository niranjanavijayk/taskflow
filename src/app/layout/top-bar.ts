import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TaskService } from '../core/task.service';
import { UserService } from '../core/user.service';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <strong class="brand">TaskFlow</strong>
      <nav aria-label="Main">
        <a routerLink="/tasks" routerLinkActive="active">Tasks</a>
        <a routerLink="/settings" routerLinkActive="active">Settings</a>
      </nav>
      <div class="who">
        <span class="badge" [class.warn]="tasks.overdueCount() > 0">{{ tasks.overdueCount() }} overdue</span>
        <span>{{ user.name() }}</span>
      </div>
    </header>
  `,
})
export class TopBar {
  protected readonly tasks = inject(TaskService);
  protected readonly user = inject(UserService);
}
