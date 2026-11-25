import { Routes } from '@angular/router';
import { TasksPage } from './tasks/tasks-page';
import { EditTask, unsavedChangesGuard } from './tasks/edit-task';
import { SettingsPage } from './settings/settings-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: 'tasks', component: TasksPage },
  { path: 'tasks/:id/edit', component: EditTask, canDeactivate: [unsavedChangesGuard] },
  { path: 'settings', component: SettingsPage },
  { path: '**', redirectTo: 'tasks' },
];
