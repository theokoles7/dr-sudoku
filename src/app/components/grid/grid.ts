import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CellData, emptyCell } from '../cell/cell.model';
import { Cell } from '../cell/cell';
import { Puzzle } from '../../services/puzzle';

@Component({
  selector:         'app-grid',
  imports:          [
                      Cell,
                    ],
  templateUrl:      './grid.html',
  styleUrl:         './grid.scss',
  changeDetection:  ChangeDetectionStrategy.OnPush
})
export class Grid {
  protected puzzle = inject(Puzzle);
}