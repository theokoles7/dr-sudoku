import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Puzzle }                                     from '../../services/puzzle';

@Component({
  selector:         'app-techniques',
  imports:          [],
  templateUrl:      './techniques.html',
  styleUrl:         './techniques.scss',
  changeDetection:  ChangeDetectionStrategy.OnPush
})
export class Techniques {
  protected puzzle = inject(Puzzle);
}