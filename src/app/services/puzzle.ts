import { inject, Injectable, NgZone, signal, Signal, WritableSignal } from '@angular/core';
import { HttpClient }                                                 from '@angular/common/http';

// Components
import { CellData, emptyCell } from '../components/cell/cell.model';

interface DosukuResponse {
  newboard: {
    grids: [{
      value:      number[][];
      solution:   number[][];
      difficulty: string;
    }];
  }
}

@Injectable({
  providedIn: 'root',
})
export class Puzzle {
  // Initialize API components.
  private _http =                 inject(HttpClient);
  private _ngZone =               inject(NgZone)
  private _solution: number[][] = [];

  // Define API endpoint.
  private readonly API =          "https://sudoku-api.vercel.app/api/dosuku"

  // Define puzzle extraction.
  readonly cells: Signal<CellData>[][] = Array.from({ length: 9 }, () =>
                          Array.from({ length: 9 }, () => signal<CellData>(emptyCell())));

  // Define signals/attributes.
  readonly algorithm =            signal<"Backtrack" | "Enhanced" | "Heuristic">("Backtrack");
  readonly backtracks =           signal(0);
  readonly considered =           signal(0);
  readonly difficulty =           signal<"Easy" | "Medium" | "Hard">("Medium");
  readonly guesses =              signal(0);
  readonly isCustomInput =        signal(false);
  readonly isEditing =            signal(false);
  readonly isLoading =            signal(false);
  readonly isSolving =            signal(false);
  readonly pencilMarks =          signal(false);
  readonly showConflicts =        signal(false);
  readonly speed =                signal(500);
  readonly time =                 signal(0);

  // API ===========================================================================================

  checkPuzzle(): void {
    this.showConflicts.update(v => !v);

    // TODO: Implement puzzle validation.
  }

  clearPuzzle(): void {
    // Indicate that puzzle is no longer actively being solved.
    this.isSolving.set(false);

    // Clear statistics.
    this.resetStats();

    // For each row in grid...
    for (let r = 0; r < 9; r++) {

      // For each cell in row...
      for (let c = 0; c < 9; c++) {

        // Extract cell.
        const cell = this.cells[r][c]();

        // If this cell is not part of the prompt...
        if (!cell.given) {

          // Clear the cell.
          (this.cells[r][c] as WritableSignal<CellData>).set(emptyCell());
        }
      }
    }
  }

  loadPuzzle(): void {
    // Indicate that puzzle is currently being loaded...
    this.isLoading.set(true);

    // Clear statistics.
    this.resetStats();

    // Request new puzzle from API.
    this._http.get<DosukuResponse>(this.API).subscribe({

      // Successful...
      next: (res) => {

        // Extract prompt.
        const grid = res.newboard.grids[0];

        // Extract solution.
        this._solution = grid.solution;

        // Extract difficulty.
        this.difficulty.set(grid.difficulty as "Easy" | "Medium" | "Hard");

        // Populate with prompt.
        this._applyGrid(grid.value);

        // Indicate that loading has concluded.
        this.isLoading.set(false);
      },

      // Failed...
      error: (err) => {

        // Log error.
        console.error('Dosuku fetch failed:', err);

        // Indicate that loading has concluded.
        this.isLoading.set(false);
      }
    });
  }

  resetStats(): void {
    // Clear all statistics.
    this.backtracks.set(0);
    this.considered.set(0);
    this.guesses.set(0);
    this.time.set(0);
  }

  setAlgorithm(algo: "Backtrack" | "Enhanced" | "Heuristic"): void {
    // Indicate that puzzle is not actiaely being solved.
    this.isSolving.set(false);

    // Queue algorithm.
    this.algorithm.set(algo);
  }

  toggleCustomInput(): void { this.isCustomInput.update(v => !v); }

  toggleEditing(): void { this.isEditing.update(v => !v); }

  togglePencilMarks(): void { this.pencilMarks.update(v => !v); }

  toggleSolving(): void {
    this.isSolving.update(v => !v);

    // TODO: Implement algorithm routing.
  }

  // HELPERS =======================================================================================

  private _applyGrid(value: number[][]): void {
    // For each row in the grid...
    for (let r = 0; r < 9; r++) {

      // For each cell in the row...
      for (let c = 0; c < 9; c++) {

        // Extract the value.
        const v = value[r][c];

        this._ngZone.run(() => {

          // Assign the value to the cell component of the grid, by...
          (this.cells[r][c] as WritableSignal<CellData>).set({

            // Clearing the cell...
            ...emptyCell(),

            // Assigning the value...
            value: v,

            // And indicating if this is part of the prompt or not.
            given: v !== 0
          });
        });
      }
    }
  }

  // TECHNIQUES ======================================================================================

  applySingleBlank():  void { /* TODO */ }
  applyNakedSingle():  void { /* TODO */ }
  applyNakedDouble():  void { /* TODO */ }
  applyNakedTriple():  void { /* TODO */ }
  applyNakedQuad():    void { /* TODO */ }
  applyXWing():        void { /* TODO */ }

}