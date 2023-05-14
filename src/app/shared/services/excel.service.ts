import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportExcel(excelData) {
    const titulo = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Hoja 1');
    worksheet.addRow([]);
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })
    data.forEach(d => {
      let row = worksheet.addRow(d);
      let sales = row.getCell(6);
    }
    );
    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, titulo + '.xlsx');
    })
  }

}
