import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private   _theme =  signal<"dark" | "lite">(
                        localStorage.getItem("theme") as "dark" | "lite" ?? "dark"
                      );

  readonly  theme =   this._theme.asReadonly();

  constructor() {
    effect(() => {
      const t = this._theme();
      document.documentElement.classList.toggle("lite-theme", t === "lite");
      localStorage.setItem("theme", t)
    })
  }

  toggle() {
    this._theme.set(this._theme() === "dark" ? "lite" : "dark");
  }
}
