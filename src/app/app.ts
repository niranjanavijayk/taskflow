import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBar } from './layout/top-bar';
import { TaskService } from './core/task.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopBar],
  template: `<app-top-bar /><main><router-outlet /></main>`,
})
export class App {
  constructor() {
    inject(TaskService).load(); // the top bar needs the count on every page
  }
}
