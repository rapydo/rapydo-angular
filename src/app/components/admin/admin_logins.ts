import { Component, ViewChild, TemplateRef, Injector } from "@angular/core";

import { Login } from "@rapydo/types";
import { ExcelService } from "@rapydo/services/excel";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";
import { environment } from "@rapydo/../environments/environment";
import * as moment from "moment";

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

      // {
      //   name: "Members",
      //   prop: "members",
      //   flexGrow: 0.3,
      //   cellTemplate: this.membersCell,
      // },
      // {
      //   name: "Coordinator(s)",
      //   prop: "coordinators",
      //   cellTemplate: this.coordinatorsCell,
      //   sortable: false,
      //   flexGrow: 1,
      // },
      // {
      //   name: "controls",
      //   prop: "controls",
      //   cellTemplate: this.controlsCell,
      //   headerTemplate: this.emptyHeader,
      //   sortable: false,
      //   flexGrow: 0.2,
      //   minWidth: 60,
      // },
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
    const m = moment().format("YYYYMMDD_HHmmss");
    const filename = `${environment.projectName}_logins_${m}.xlsx`;

    const headers = ["Date", "Username", "IP", "Location", "Failed Login"];
    let download_data = [];

    for (let d of this.unfiltered_data) {
      download_data.push([
        { t: "d", v: moment(d["date"]).format("YYYY-MM-DD HH:mm:ss") },
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
