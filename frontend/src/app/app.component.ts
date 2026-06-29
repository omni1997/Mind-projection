import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  dark = signal(localStorage.getItem('theme') === 'dark');

  constructor() {
    this.applyTheme(this.dark());
  }

  toggleTheme() {
    const next = !this.dark();
    this.dark.set(next);
    this.applyTheme(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  private applyTheme(dark: boolean) {
    document.documentElement.classList.toggle('dark', dark);
  }
}
