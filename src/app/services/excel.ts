import { Injectable } from "@angular/core";

// Docs here: https://docs.sheetjs.com/
import * as XLSX from "xlsx";

@Injectable()
export class ExcelService {
  constructor() {}

  public createWorkbook() {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    return workbook;
    // let workbook = new Excel.Workbook();
    // return workbook;
  }
  public saveAs(workbook, filename) {
    // Since styles cannot be used, cellStyles is probably useless
    XLSX.writeFile(workbook, filename, { cellStyles: true });

    // workbook.xlsx.writeBuffer().then((data) => {
    //   let blob = new Blob([data], {
    //     type:
    //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   });
    //   importedSaveAs(blob, filename);
    // });
  }
  public addWorksheet(workbook, name, headers, data) {
    // const worksheet = workbook.addWorksheet(name);
    // this.addHeader(worksheet, headers);
    // worksheet.addRows(data);

    // Unstyled header...
    // Styles are not included in community edition but are part of the Pro build
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers]);
    // origin: -1 option will append rows to the end of the file
    XLSX.utils.sheet_add_aoa(worksheet, data, { origin: -1 });

    XLSX.utils.book_append_sheet(workbook, worksheet, name);
  }
}

// This bundle is built without polyfill leaving apps the freedom to add their own
// It avoid the following error:
// Zone.js has detected that ZoneAwarePromise (window|global).Promise has been overwritten.
// Most likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)
// https://github.com/exceljs/exceljs/issues/1008
// This bundle skips ALL polyfills, included core-js and regenerator-runtime
// that are still needed
// => added regenerator-runtime to package.json and polyfills
// import * as Excel from "exceljs/dist/exceljs.bare.min.js";

// import { saveAs as importedSaveAs } from "file-saver-es";

// public addHeader(worksheet, header) {
//   // Add Header Row
//   let headerRow = worksheet.addRow(header);

//   headerRow.eachCell((cell, number) => {
//     cell.fill = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FF000000" },
//       bgColor: { argb: "FFCCCCCC" },
//     };
//     cell.border = {
//       top: { style: "thin" },
//       left: { style: "thin" },
//       bottom: { style: "double" },
//       right: { style: "thin" },
//     };
//     cell.style = { font: { bold: true } };
//   });

//   return headerRow;
// }
