import { Component, inject }  from '@angular/core';
import { RouterLink }         from '@angular/router';

// Services
import { Puzzle }             from '../../services/puzzle';

@Component({
  selector:     'app-controls',
  imports:      [],
  templateUrl:  './controls.html',
  styleUrl:     './controls.scss',
})
export class Controls {
  protected puzzle = inject(Puzzle);
}
