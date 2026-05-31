import { inject, Injectable, NgZone, signal, Signal, WritableSignal } from '@angular/core';
import { HttpClient }                                                 from '@angular/common/http';

// Models
import { CellData, emptyCell }                                        from '../components/cell/cell.model';

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
  private _ngZone =               inject(NgZone);
  private _solution: number[][] = [];

  // Define API endpoint.
  private readonly API = "https://sudoku-api.vercel.app/api/dosuku";

  // Define puzzle grid.
  readonly cells: Signal<CellData>[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => signal<CellData>(emptyCell())));

  // Define signals.
  readonly algorithm =    signal<"Backtrack" | "Enhanced" | "Heuristic">("Backtrack");
  readonly backtracks =   signal(0);
  readonly considered =   signal(0);
  readonly difficulty =   signal<"Easy" | "Medium" | "Hard">("Medium");
  readonly guesses =      signal(0);
  readonly isCustomInput= signal(false);
  readonly isEditing =    signal(false);
  readonly isLoading =    signal(false);
  readonly isSolving =    signal(false);
  readonly pencilMarks =  signal(false);
  readonly showConflicts= signal(false);
  readonly speed =        signal(500);
  readonly time =         signal(0);

  // API ===========================================================================================

  checkPuzzle(): void {
    this.showConflicts.update(v => !v);
    // TODO: Implement puzzle validation.
  }

  clearPuzzle(): void {
    this._stopSolver();
    this.resetStats();

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = this.cells[r][c]();
        if (!cell.given) {
          (this.cells[r][c] as WritableSignal<CellData>).set(emptyCell());
        }
      }
    }
  }

  loadPuzzle(): void {
    this._stopSolver();
    this.isLoading.set(true);
    this.resetStats();

    this._http.get<DosukuResponse>(this.API).subscribe({
      next: (res) => {
        const grid = res.newboard.grids[0];
        this._solution = grid.solution;
        this.difficulty.set(grid.difficulty as "Easy" | "Medium" | "Hard");
        this._applyGrid(grid.value);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Dosuku fetch failed:', err);
        this.isLoading.set(false);
      }
    });
  }

  resetStats(): void {
    this.backtracks.set(0);
    this.considered.set(0);
    this.guesses.set(0);
    this.time.set(0);
  }

  setAlgorithm(algo: "Backtrack" | "Enhanced" | "Heuristic"): void {
    this._stopSolver();
    this.algorithm.set(algo);
  }

  toggleCustomInput(): void { this.isCustomInput.update(v => !v); }
  toggleEditing():     void { this.isEditing.update(v => !v); }
  togglePencilMarks(): void { this.pencilMarks.update(v => !v); }

  toggleSolving(): void {
    this.isSolving.update(v => !v);

    if (this.isSolving()) {
      // Start or resume — run outside Angular's zone
      this._ngZone.runOutsideAngular(() => this._backtrack());
    }
    // Pause is handled inside _backtrack() via isSolving() polling
  }

  // SOLVER ========================================================================================

  private _stopSolver(): void {
    // Flipping isSolving to false causes _backtrack() to bail out of its polling loop
    this.isSolving.set(false);
  }

  private _delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.speed()));
  }

  private async _backtrack(): Promise<boolean> {
    // For each row...
    for (let r = 0; r < 9; r++) {

      // For each cell...
      for (let c = 0; c < 9; c++) {

        // If cell is empty...
        if (this.cells[r][c]().value === 0) {

          // Try each candidate value...
          for (let n = 1; n <= 9; n++) {

            // Increment considered count.
            this._ngZone.run(() => this.considered.update(v => v + 1));

            // Wait for tempo delay.
            await this._delay();

            // Poll while paused.
            while (!this.isSolving()) {
              await this._delay();

              // If solver was stopped entirely (new puzzle/clear), bail out.
              if (!this.isSolving()) return false;
            }

            // If candidate is valid...
            if (this._isValid(r, c, n)) {

              // Place value and mark as current.
              this._ngZone.run(() => {
                (this.cells[r][c] as WritableSignal<CellData>).update(v => ({
                  ...v, value: n, current: true, visited: false
                }));
                this.guesses.update(v => v + 1);
              });

              // Recurse.
              if (await this._backtrack()) return true;

              // Backtrack — clear cell and mark as unvisited.
              this._ngZone.run(() => {
                (this.cells[r][c] as WritableSignal<CellData>).set({
                  ...emptyCell()
                });
                this.backtracks.update(v => v + 1);
              });
            }
          }

          // No valid value found — signal backtrack to caller.
          this._ngZone.run(() => {
            (this.cells[r][c] as WritableSignal<CellData>).update(v => ({
              ...v, current: false, visited: false
            }));
          });

          return false;
        }
      }
    }

    // No empty cells remaining — puzzle solved.
    this._ngZone.run(() => {
      // Mark all non-given cells as visited.
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!this.cells[r][c]().given) {
            (this.cells[r][c] as WritableSignal<CellData>).update(v => ({
              ...v, current: false, visited: true
            }));
          }
        }
      }
      this.isSolving.set(false);
    });

    return true;
  }

  private _isValid(r: number, c: number, val: number): boolean {
    // Check row.
    for (let i = 0; i < 9; i++) {
      if (i !== c && this.cells[r][i]().value === val) return false;
    }

    // Check column.
    for (let i = 0; i < 9; i++) {
      if (i !== r && this.cells[i][c]().value === val) return false;
    }

    // Check 3x3 box.
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let i = br; i < br + 3; i++) {
      for (let j = bc; j < bc + 3; j++) {
        if (i !== r && j !== c && this.cells[i][j]().value === val) return false;
      }
    }

    return true;
  }

  // HELPERS =======================================================================================

  private _applyGrid(value: number[][]): void {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = value[r][c];
        this._ngZone.run(() => {
          (this.cells[r][c] as WritableSignal<CellData>).set({
            ...emptyCell(),
            value: v,
            given: v !== 0
          });
        });
      }
    }
  }

  // TECHNIQUES ====================================================================================

  applySingleBlank():  void { /* TODO */ }
  applyNakedSingle():  void { /* TODO */ }
  applyNakedDouble():  void { /* TODO */ }
  applyNakedTriple():  void { /* TODO */ }
  applyNakedQuad():    void { /* TODO */ }
  applyXWing():        void { /* TODO */ }
}