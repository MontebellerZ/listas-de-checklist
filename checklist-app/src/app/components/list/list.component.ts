import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Modal } from 'bootstrap';
import { ChecklistService } from '../../services/checklist.service';
import { ExportService } from '../../services/export.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, OnDestroy {
  checklistService = inject(ChecklistService);
  exportService = inject(ExportService);
  themeService = inject(ThemeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  autoSave = false;
  editNameValue = '';
  pendingDeleteRowId: string | null = null;

  private changeSubject = new Subject<void>();
  private changeSubscription: Subscription = Subscription.EMPTY;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    const found = this.checklistService.loadList(id);
    if (!found) {
      this.router.navigate(['/']);
      return;
    }
    this.changeSubscription = this.changeSubject.pipe(debounceTime(2000)).subscribe(() => {
      if (this.autoSave) this.save();
    });
  }

  ngOnDestroy(): void {
    this.changeSubscription.unsubscribe();
  }

  get list() { return this.checklistService.currentList(); }
  get isDirty() { return this.checklistService.isDirty(); }

  save(): void {
    this.checklistService.saveCurrentList();
  }

  onAutoSaveChange(): void {
    if (this.autoSave && this.isDirty) {
      this.changeSubject.next();
    }
  }

  triggerChange(): void {
    this.changeSubject.next();
  }

  addRow(): void {
    this.checklistService.addRow();
    this.triggerChange();
  }

  addColumn(): void {
    this.checklistService.addColumn();
    this.triggerChange();
  }

  updateRowItem(rowId: string, value: string): void {
    this.checklistService.updateRowItem(rowId, value);
    this.triggerChange();
  }

  updateRowCheck(rowId: string, colId: string, value: boolean): void {
    this.checklistService.updateRowCheck(rowId, colId, value);
    this.triggerChange();
  }

  updateColumnName(colId: string, value: string): void {
    this.checklistService.updateColumnName(colId, value);
    this.triggerChange();
  }

  removeRow(rowId: string): void {
    this.pendingDeleteRowId = rowId;
    const modal = new Modal(document.getElementById('deleteRowModal')!);
    modal.show();
  }

  confirmDeleteRow(): void {
    if (this.pendingDeleteRowId) {
      this.checklistService.removeRow(this.pendingDeleteRowId);
      this.pendingDeleteRowId = null;
      this.triggerChange();
    }
    Modal.getInstance(document.getElementById('deleteRowModal')!)?.hide();
  }

  goBack(): void {
    if (this.isDirty) {
      const modal = new Modal(document.getElementById('confirmBackModal')!);
      modal.show();
    } else {
      this.router.navigate(['/']);
    }
  }

  confirmBack(): void {
    Modal.getInstance(document.getElementById('confirmBackModal')!)?.hide();
    this.router.navigate(['/']);
  }

  openEditNameModal(): void {
    this.editNameValue = this.list?.name ?? '';
    const modal = new Modal(document.getElementById('editNameModal')!);
    modal.show();
  }

  confirmEditName(): void {
    if (this.editNameValue.trim()) {
      this.checklistService.updateListName(this.editNameValue.trim());
      this.triggerChange();
    }
    Modal.getInstance(document.getElementById('editNameModal')!)?.hide();
  }

  openDeleteListModal(): void {
    const modal = new Modal(document.getElementById('deleteListModal')!);
    modal.show();
  }

  confirmDeleteList(): void {
    const id = this.list?.id;
    if (id) {
      this.checklistService.deleteList(id);
    }
    Modal.getInstance(document.getElementById('deleteListModal')!)?.hide();
    this.router.navigate(['/']);
  }

  exportToExcel(): void {
    if (this.list) {
      this.exportService.exportToExcel(this.list);
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
