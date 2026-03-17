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
  columns: ChecklistColumn[];
  rows: ChecklistRow[];
  createdAt: string;
  updatedAt: string;
}
