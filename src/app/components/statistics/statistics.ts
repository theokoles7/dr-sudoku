import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Puzzle }                                     from '../../services/puzzle';

@Component({
  selector:         'app-statistics',
  imports:          [],
  templateUrl:      './statistics.html',
  styleUrl:         './statistics.scss',
  changeDetection:  ChangeDetectionStrategy.OnPush
})
export class Statistics {
  protected puzzle = inject(Puzzle);

  protected formatTime(ms: number): string {
    // Calculate minutes passed.
    const m = Math.floor(ms / 60000);

    // Calculate seconds passed.
    const s = Math.floor((ms % 60000) / 1000);

    // Provide formatted time string.
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}