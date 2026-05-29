import { Component, signal, inject, OnInit }  from '@angular/core';
import { RouterOutlet }       from '@angular/router';
import { Puzzle } from './services/puzzle';

@Component({
  selector:     'app-root',
  imports:      [
                  RouterOutlet,
                ],
  templateUrl:  './app.html',
  styleUrl:     './app.scss'
})
export class App {
  protected readonly title = signal('dr-sudoku');
  private sudokuService = inject(Puzzle);

  ngOnInit(): void {
    this.sudokuService.loadPuzzle();
  }
}
