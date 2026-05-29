import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Puzzle }                                     from '../../services/puzzle';

@Component({
  selector:         'app-algorithms',
  imports:          [],
  templateUrl:      './algorithms.html',
  styleUrl:         './algorithms.scss',
  changeDetection:  ChangeDetectionStrategy.OnPush
})
export class Algorithms {
  protected puzzle = inject(Puzzle);
}