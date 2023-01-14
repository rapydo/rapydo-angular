import { Component, ViewChild, TemplateRef, Injector } from "@angular/core";

import { Login } from "@rapydo/types";
import { ExcelService } from "@rapydo/services/excel";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";
import { environment } from "@rapydo/../environments/environment";
import { format, parse } from "date-fns";

@Component({
  templateUrl: "./admin_logins.html",
})
export class AdminLoginsComponent extends BasePaginationComponent<Login> {
  @ViewChild("dateCell", { static: false })
  public dateCell: TemplateRef<any>;
  @ViewChild("failedCell", { static: false })
  public failedCell: TemplateRef<any>;

  constructor(protected injector: Injector, private excel: ExcelService) {
    super(injector);
    this.init("login", "/api/admin/logins", "Logins");
    this.initPaging();
    this.list();
  }

  public ngOnInit(): void {}
  public ngAfterViewInit(): void {
    this.columns = [
      {
        name: "",
        prop: "failed",
        flexGrow: 0.5,
        cellTemplate: this.failedCell,
        sortable: false,
      },
      { name: "User", prop: "username", flexGrow: 5 },
      { name: "Date", prop: "date", flexGrow: 5, cellTemplate: this.dateCell },
      { name: "IP", prop: "IP", flexGrow: 3 },
      { name: "Location", prop: "location", flexGrow: 3 },
    ];
  }

  filter(data_filter) {
    return this.unfiltered_data.filter(function (d) {
      if (d.username.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.location.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.IP.indexOf(data_filter) !== -1) {
        return true;
      }
      return false;
    });
  }

  download() {
    const m = format(new Date(), "yyyyMMdd_HHmmss");
    const filename = `${environment.projectName}_logins_${m}.xlsx`;

    const headers = ["Date", "Username", "IP", "Location", "Failed Login"];
    let download_data = [];

    for (let d of this.unfiltered_data) {
      download_data.push([
        // datetimes in isoformat and recognized as UTC, this way are correctly converted as local time
        { t: "d", v: format(new Date(d["date"]), "yyyy-MM-dd HH:mm:ss") },
        d["username"],
        d["IP"],
        d["location"],
        d["failed"],
      ]);
    }

    const workbook = this.excel.createWorkbook();
    this.excel.addWorksheet(workbook, "Logins", headers, download_data);
    this.excel.saveAs(workbook, filename);
  }
}
