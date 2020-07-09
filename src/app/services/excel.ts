import { Injectable } from "@angular/core";

// This bundle is built without polyfill leaving apps the freedom to add their own
// It avoid the following error:
// Zone.js has detected that ZoneAwarePromise (window|global).Promise has been overwritten.
// Most likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)
// https://github.com/exceljs/exceljs/issues/1008
// This bundle skips ALL polyfills, included regenerator-runtime that is still needed
// => added regenerator-runtime to package.json and imported here
import "regenerator-runtime/runtime";

import * as Excel from "exceljs/dist/exceljs.bare.min.js";

import { saveAs as importedSaveAs } from "file-saver";

@Injectable()
export class ExcelService {
  constructor() {}

  public createWorkbook() {
    let workbook = new Excel.Workbook();
    return workbook;
  }
  public saveAs(workbook, filename) {
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      importedSaveAs(blob, filename);
    });
  }
  public addHeader(worksheet, header) {
    // Add Header Row
    let headerRow = worksheet.addRow(header);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF000000" },
        bgColor: { argb: "FFCCCCCC" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "double" },
        right: { style: "thin" },
      };
      cell.style = { font: { bold: true } };
    });

    return headerRow;
  }
}
