import { Injectable } from '@angular/core';
import { ChecklistList } from '../models/checklist.model';
import ExcelJS from 'exceljs';

@Injectable({ providedIn: 'root' })
export class ExportService {
  async exportToExcel(list: ChecklistList): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(list.name);

    sheet.columns = [
      { header: 'Item', key: 'item', width: 30 },
      ...list.columns.map(col => ({ header: col.name, key: col.id, width: 15 }))
    ];

    sheet.getRow(1).font = { bold: true };

    list.rows.forEach(row => {
      const rowData: Record<string, string> = { item: row.itemName };
      list.columns.forEach(col => {
        rowData[col.id] = row.checks[col.id] ? '✓' : '';
      });
      sheet.addRow(rowData);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer as ArrayBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${list.name}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
