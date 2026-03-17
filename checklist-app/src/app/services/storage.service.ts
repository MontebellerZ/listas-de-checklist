import { Injectable } from '@angular/core';
import { ChecklistList } from '../models/checklist.model';

const STORAGE_KEY = 'checklist_lists';

/** Shape of persisted data before the itemColumnName field was introduced */
type PersistedList = Omit<ChecklistList, 'itemColumnName'> & { itemColumnName?: string };

@Injectable({ providedIn: 'root' })
export class StorageService {
  getLists(): ChecklistList[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const lists: PersistedList[] = raw ? JSON.parse(raw) : [];
      // Backward-compat: ensure itemColumnName exists on all loaded lists
      return lists.map(l => ({ ...l, itemColumnName: l.itemColumnName ?? 'Item' }));
    } catch {
      return [];
    }
  }

  saveLists(lists: ChecklistList[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }

  getList(id: string): ChecklistList | undefined {
    return this.getLists().find(l => l.id === id);
  }

  saveList(list: ChecklistList): void {
    const lists = this.getLists();
    const idx = lists.findIndex(l => l.id === list.id);
    if (idx >= 0) {
      lists[idx] = list;
    } else {
      lists.push(list);
    }
    this.saveLists(lists);
  }

  deleteList(id: string): void {
    const lists = this.getLists().filter(l => l.id !== id);
    this.saveLists(lists);
  }
}
