export type ModuleElementClass = 'LOCKER_CERRADO' | 'LOCKER_BLOCK' | 'SCREEN';

export interface ModuleElement {
  text: string;
  cols: number;
  rows: number;
  class: ModuleElementClass;
}

export interface ModuleColumn {
  elements: ModuleElement[];
}

export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  gridCols: number; // total columns in the CSS grid
  gridRows: number; // total rows in the CSS grid
  columns: ModuleColumn[];
}

// Hardcoded example modules
export const MODULE_TEMPLATES: ModuleTemplate[] = [
  {
    id: "module-cm",
    name: "CM",
    description: "Compact Module",
    gridCols: 4,
    gridRows: 18,
    columns: [
      {
        elements: [
          { text: "1", cols: 2, rows: 1, class: "LOCKER_CERRADO" },
          { text: "2", cols: 2, rows: 1, class: "LOCKER_CERRADO" },
          { text: "3", cols: 2, rows: 1, class: "LOCKER_CERRADO" },
          { text: "4", cols: 2, rows: 2, class: "LOCKER_CERRADO" },
          { text: "5", cols: 2, rows: 2, class: "LOCKER_CERRADO" },
          { text: "6", cols: 2, rows: 3, class: "LOCKER_CERRADO" },
          { text: "7", cols: 2, rows: 5, class: "LOCKER_CERRADO" },
          { text: "", cols: 2, rows: 3, class: "LOCKER_BLOCK" },
        ],
      },
      {
        elements: [
          { text: "8", cols: 2, rows: 1, class: "LOCKER_CERRADO" },
          { text: "9", cols: 2, rows: 1, class: "LOCKER_CERRADO" },
          { text: "10", cols: 2, rows: 1, class: "LOCKER_CERRADO" },
          { text: "11", cols: 2, rows: 2, class: "LOCKER_CERRADO" },
          { text: "12", cols: 2, rows: 2, class: "LOCKER_CERRADO" },
          { text: "13", cols: 2, rows: 3, class: "LOCKER_CERRADO" },
          { text: "14", cols: 2, rows: 5, class: "LOCKER_CERRADO" },
          { text: "", cols: 2, rows: 3, class: "LOCKER_BLOCK" },
        ],
      },
    ],
  },
  {
    id: "module-c",
    name: "C",
    description: "Standard Module",
    gridCols: 4,
    gridRows: 18,
    columns: [
      {
        elements: [
          { text: "1", cols: 4, rows: 1, class: "LOCKER_CERRADO" },
          { text: "2", cols: 4, rows: 1, class: "LOCKER_CERRADO" },
          { text: "3", cols: 4, rows: 1, class: "LOCKER_CERRADO" },
          { text: "4", cols: 4, rows: 2, class: "LOCKER_CERRADO" },
          { text: "5", cols: 4, rows: 2, class: "LOCKER_CERRADO" },
          { text: "6", cols: 4, rows: 3, class: "LOCKER_CERRADO" },
          { text: "7", cols: 4, rows: 5, class: "LOCKER_CERRADO" },
          { text: "", cols: 4, rows: 3, class: "LOCKER_BLOCK" },
        ],
      },
    ],
  },
  {
    id: "module-d",
    name: "D",
    description: "Mixed with Screen",
    gridCols: 4,
    gridRows: 18,
    columns: [
      {
        elements: [
          { text: "1", cols: 2, rows: 2, class: "LOCKER_CERRADO" },
          { text: "2", cols: 2, rows: 2, class: "LOCKER_CERRADO" },
          { text: "3", cols: 2, rows: 3, class: "LOCKER_CERRADO" },
          { text: "4", cols: 2, rows: 5, class: "LOCKER_CERRADO" },
          { text: "", cols: 2, rows: 3, class: "LOCKER_BLOCK" },
          { text: "SCREEN", cols: 2, rows: 3, class: "SCREEN" },
        ],
      },
      {
        elements: [
          { text: "5", cols: 2, rows: 1, class: "LOCKER_CERRADO" },
          { text: "6", cols: 2, rows: 1, class: "LOCKER_CERRADO" },
          { text: "7", cols: 2, rows: 1, class: "LOCKER_CERRADO" },
          { text: "8", cols: 2, rows: 2, class: "LOCKER_CERRADO" },
          { text: "9", cols: 2, rows: 3, class: "LOCKER_CERRADO" },
          { text: "10", cols: 2, rows: 5, class: "LOCKER_CERRADO" },
          { text: "", cols: 2, rows: 5, class: "LOCKER_BLOCK" },
        ],
      },
    ],
  },
  {
    id: "module-b",
    name: "B",
    description: "Large Focus",
    gridCols: 4,
    gridRows: 18,
    columns: [
      {
        elements: [
          { text: "1", cols: 4, rows: 3, class: "LOCKER_CERRADO" },
          { text: "2", cols: 4, rows: 3, class: "LOCKER_CERRADO" },
          { text: "3", cols: 4, rows: 5, class: "LOCKER_CERRADO" },
          { text: "4", cols: 4, rows: 5, class: "LOCKER_CERRADO" },
          { text: "", cols: 4, rows: 2, class: "LOCKER_BLOCK" },
        ],
      },
    ],
  },
  {
    id: "module-e",
    name: "E",
    description: "XL Stack with Screen",
    gridCols: 4,
    gridRows: 18,
    columns: [
      {
        elements: [
          { text: "1", cols: 4, rows: 5, class: "LOCKER_CERRADO" },
          { text: "2", cols: 4, rows: 5, class: "LOCKER_CERRADO" },
          { text: "SCREEN", cols: 4, rows: 3, class: "SCREEN" },
          { text: "", cols: 4, rows: 5, class: "LOCKER_BLOCK" },
        ],
      },
    ],
  },
];
