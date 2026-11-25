import { Injectable, signal } from '@angular/core';

/** Shared state: one owner, read by the top bar and the Settings page. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _name = signal('Alex Morgan');
  readonly name = this._name.asReadonly();
}
