import { Component, ChangeDetectionStrategy, input, Signal }  from '@angular/core';
import { CellData }                                   from './cell.model';

@Component({
  selector:         'app-cell',
  imports:          [],
  templateUrl:      './cell.html',
  styleUrl:         './cell.scss',
  changeDetection:  ChangeDetectionStrategy.OnPush
})
export class Cell {
  cell = input.required<CellData>();
}