import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  isDark = signal<boolean>(false);

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDark.set(saved ? saved === 'dark' : prefersDark);
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
    this.applyTheme();
    localStorage.setItem(this.STORAGE_KEY, this.isDark() ? 'dark' : 'light');
  }

  private applyTheme(): void {
    document.documentElement.setAttribute('data-bs-theme', this.isDark() ? 'dark' : 'light');
  }
}
