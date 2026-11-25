import { Component, inject } from '@angular/core';
import { UserService } from '../core/user.service';

@Component({
  selector: 'app-settings-page',
  template: `
    <section class="panel narrow">
      <h2>Settings</h2>
      <dl>
        <dt>Signed in as</dt>
        <dd>{{ user.name() }}</dd>
      </dl>
    </section>
  `,
})
export class SettingsPage {
  protected readonly user = inject(UserService);
}
