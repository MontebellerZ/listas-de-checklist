import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { ChecklistService } from '../../services/checklist.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  checklistService = inject(ChecklistService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  newListName = '';

  sortedLists = computed(() =>
    [...this.checklistService.lists()].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  );

  openNewListModal(): void {
    this.newListName = '';
    const modal = new Modal(document.getElementById('newListModal')!);
    modal.show();
  }

  createList(): void {
    if (!this.newListName.trim()) return;
    const list = this.checklistService.createList(this.newListName.trim());
    Modal.getInstance(document.getElementById('newListModal')!)?.hide();
    this.router.navigate(['/list', list.id]);
  }

  navigateToList(id: string): void {
    this.router.navigate(['/list', id]);
  }

  deleteListFromHome(id: string): void {
    this.checklistService.deleteList(id);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
