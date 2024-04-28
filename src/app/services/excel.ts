import { Injectable } from "@angular/core";

// Docs here: https://docs.sheetjs.com/
import * as XLSX from "xlsx";

@Injectable()
export class ExcelService {
  constructor() {}

  public createWorkbook() {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    return workbook;
  }

  public saveAs(workbook, filename) {
    // Since styles cannot be used, cellStyles is probably useless
    XLSX.writeFile(workbook, filename, { cellStyles: true });
  }
  public addWorksheet(workbook, name, headers, data) {
    // Unstyled header...
    // Styles are not included in community edition but are part of the Pro build
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers]);
    // origin: -1 option will append rows to the end of the file
    XLSX.utils.sheet_add_aoa(worksheet, data, { origin: -1 });

    XLSX.utils.book_append_sheet(workbook, worksheet, name);
  }
}
