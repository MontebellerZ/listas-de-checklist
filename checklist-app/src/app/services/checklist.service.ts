import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { ChecklistList, ChecklistColumn, ChecklistRow } from '../models/checklist.model';

@Injectable({ providedIn: 'root' })
export class ChecklistService {
  private storage = inject(StorageService);

  lists = signal<ChecklistList[]>(this.storage.getLists());
  currentList = signal<ChecklistList | null>(null);
  isDirty = signal<boolean>(false);

  createList(name: string): ChecklistList {
    const now = new Date().toISOString();
    const col: ChecklistColumn = { id: crypto.randomUUID(), name: 'Checkbox 1' };
    const row: ChecklistRow = {
      id: crypto.randomUUID(),
      itemName: '',
      checks: { [col.id]: false }
    };
    const list: ChecklistList = {
      id: crypto.randomUUID(),
      name,
      itemColumnName: 'Item',
      columns: [col],
      rows: [row],
      createdAt: now,
      updatedAt: now
    };
    this.storage.saveList(list);
    this.lists.set(this.storage.getLists());
    return list;
  }

  updateList(list: ChecklistList): void {
    this.storage.saveList(list);
    this.lists.set(this.storage.getLists());
  }

  deleteList(id: string): void {
    this.storage.deleteList(id);
    this.lists.set(this.storage.getLists());
  }

  loadList(id: string): boolean {
    const list = this.storage.getList(id);
    if (!list) return false;
    this.currentList.set(list);
    this.isDirty.set(false);
    return true;
  }

  addRow(): void {
    const list = this.currentList();
    if (!list) return;
    const checks: { [colId: string]: boolean } = {};
    list.columns.forEach(col => { checks[col.id] = false; });
    const newRow: ChecklistRow = {
      id: crypto.randomUUID(),
      itemName: '',
      checks
    };
    this.currentList.set({ ...list, rows: [...list.rows, newRow] });
    this.markDirty();
  }

  removeRow(rowId: string): void {
    const list = this.currentList();
    if (!list) return;
    this.currentList.set({ ...list, rows: list.rows.filter(r => r.id !== rowId) });
    this.markDirty();
  }

  addColumn(): void {
    const list = this.currentList();
    if (!list) return;
    const newCol: ChecklistColumn = {
      id: crypto.randomUUID(),
      name: `Checkbox ${list.columns.length + 1}`
    };
    const updatedRows = list.rows.map(row => ({
      ...row,
      checks: { ...row.checks, [newCol.id]: false }
    }));
    this.currentList.set({ ...list, columns: [...list.columns, newCol], rows: updatedRows });
    this.markDirty();
  }

  updateRowItem(rowId: string, value: string): void {
    const list = this.currentList();
    if (!list) return;
    this.currentList.set({
      ...list,
      rows: list.rows.map(r => r.id === rowId ? { ...r, itemName: value } : r)
    });
    this.markDirty();
  }

  updateRowCheck(rowId: string, columnId: string, value: boolean): void {
    const list = this.currentList();
    if (!list) return;
    this.currentList.set({
      ...list,
      rows: list.rows.map(r =>
        r.id === rowId ? { ...r, checks: { ...r.checks, [columnId]: value } } : r
      )
    });
    this.markDirty();
  }

  updateColumnName(columnId: string, name: string): void {
    const list = this.currentList();
    if (!list) return;
    this.currentList.set({
      ...list,
      columns: list.columns.map(c => c.id === columnId ? { ...c, name } : c)
    });
    this.markDirty();
  }

  updateItemColumnName(name: string): void {
    const list = this.currentList();
    if (!list) return;
    this.currentList.set({ ...list, itemColumnName: name });
    this.markDirty();
  }

  updateListName(name: string): void {
    const list = this.currentList();
    if (!list) return;
    this.currentList.set({ ...list, name });
    this.markDirty();
  }

  saveCurrentList(): void {
    const list = this.currentList();
    if (!list) return;
    const updated = { ...list, updatedAt: new Date().toISOString() };
    this.currentList.set(updated);
    this.storage.saveList(updated);
    this.lists.set(this.storage.getLists());
    this.markClean();
  }

  markDirty(): void { this.isDirty.set(true); }
  markClean(): void { this.isDirty.set(false); }
}
