export interface CellData {
  value:        number;
  conflict:     boolean;
  current:      boolean;
  given:        boolean;
  highlighted:  boolean;
  selected:     boolean;
  visited:      boolean;
  pencil_marks: boolean[];
}

export function emptyCell(): CellData {
  return {
    conflict:     false,
    current:      false,
    given:        false,
    highlighted:  false,
    selected:     false,
    pencil_marks: Array(9).fill(false),
    value:        0,
    visited:      false,
  };
}