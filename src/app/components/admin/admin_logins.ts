import { Component, ViewChild, TemplateRef, Injector } from "@angular/core";

import { Login } from "@rapydo/types";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";

@Component({
  templateUrl: "./admin_logins.html",
})
export class AdminLoginsComponent extends BasePaginationComponent<Login> {
  @ViewChild("dateCell", { static: false })
  public dateCell: TemplateRef<any>;
  @ViewChild("failedCell", { static: false })
  public failedCell: TemplateRef<any>;

  constructor(protected injector: Injector) {
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
      return false;
    });
  }
}
