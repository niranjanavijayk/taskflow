# TaskFlow

A small Angular 21 task app built for the State Management assessment. State is managed only with signals, signal services, the URL and reactive forms. No NgRx and no RxJS Subjects.

## A. How to run

```bash
npm install
ng serve        # or: npm start
```

Open http://localhost:4200. Node 20.19+ is required.

## Screenshots

_Add screenshots here: Tasks page, Edit task page with the unsaved-changes warning, Settings page._

## B. State table

| # | Data | Kind | Where it lives | Why |
|---|------|------|----------------|-----|
| 1 | Search text | URL | `?q=` query param, bound into `TasksPage` through a route input | It must survive a refresh, so the URL owns it and the list only reads it. |
| 2 | Selected status tab | URL | `?status=` query param, bound into `TasksPage` | It is a shareable view of the list, so it follows the same rule as search. |
| 3 | Compact view on/off | Local UI | `compact` signal inside `TaskList` (Level 1) | Only the list uses it, so it stays in the component. |
| 4 | Task list from the API | Server | `TaskService` (root), private `_tasks` signal exposed with `asReadonly()` | It is a copy of backend data used by the top bar, list, details and edit page; the service also holds `loading` and caches the first load. |
| 5 | Selected task | Local UI | `selectedId` signal in `TasksPage` (Level 2); the task itself is a `computed()` | The list highlights it and the details panel shows it, so the shared parent owns it and passes it down with `input()` and `output()`. |
| 6 | Edit form has unsaved changes | Form | `form.dirty` on the `FormGroup` in `EditTask`, read by the `canDeactivate` guard | The `FormGroup` already tracks dirty, so no extra signal is kept. |
| 7 | Overdue task count | Derived | `computed()` in `TaskService` | It is calculated from the task list and never stored, so it updates the moment a task changes. |
| 8 | User's name | Shared | `UserService` (root), private signal exposed with `asReadonly()` | The top bar and Settings are distant components that must show the same value. |

## C. Problems in the review code

1. **Stored copy of a derived value.** `overdueCount` is a separate `signal(0)` set inside `load()`. It is calculated from `tasks`, so it goes stale when a task is changed (for example "Mark as done"). My app uses `overdueCount = computed(...)` in `TaskService`.
2. **Public writable signals.** `tasks` and `overdueCount` can be changed with `.set()` by any component, so a wrong value could come from anywhere. My services keep writable signals private, expose `asReadonly()`, and change state only through methods such as `markDone()` and `update()`.
3. **`effect()` copying one signal into another.** `TopBarComponent` copies `overdueCount` into `countSig`, which creates a second copy of the same data. My top bar reads `TaskService.overdueCount()` directly in the template.
4. **Server state without loading or caching.** `load()` has no loading flag and nothing stops it from fetching again on every call, and it trusts a server-supplied `isOverdue` flag that becomes wrong as time passes. My service has a `loading` signal, loads once, and calculates overdue from the due date and status.

## Structure

```
src/app/
  core/      task.model.ts, task.service.ts, user.service.ts
  layout/    top-bar.ts
  tasks/     tasks-page.ts (parent), task-list.ts, task-details.ts, edit-task.ts
  settings/  settings-page.ts
```
