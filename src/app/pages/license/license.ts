import { Component, inject }  from '@angular/core';
import { Theme }              from '../../services/theme';
import { RouterLink }         from '@angular/router';

@Component({
  selector:     'app-license',
  imports:      [
                  RouterLink,
                ],
  templateUrl:  './license.html',
  styleUrl:     './license.scss',
})
export class License {
  protected themeService = inject(Theme);
}
