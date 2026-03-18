export interface ChecklistColumn {
  id: string;
  name: string;
}

export interface ChecklistRow {
  id: string;
  itemName: string;
  checks: { [columnId: string]: boolean };
}

export interface ChecklistList {
  id: string;
  name: string;
  /** Label for the first (item name) column — editable by the user */
  itemColumnName: string;
  columns: ChecklistColumn[];
  rows: ChecklistRow[];
  createdAt: string;
  updatedAt: string;
}
