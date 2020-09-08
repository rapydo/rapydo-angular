import {
  Component,
  ViewChild,
  TemplateRef,
  Input,
  Injector,
} from "@angular/core";

import { Session } from "@rapydo/types";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";

@Component({
  templateUrl: "admin_sessions.html",
})
export class AdminSessionsComponent extends BasePaginationComponent<Session> {
  @ViewChild("dataToken", { static: false }) public dataToken: TemplateRef<any>;
  @ViewChild("dataUser", { static: false }) public dataUser: TemplateRef<any>;
  @ViewChild("dataDate", { static: false }) public dataDate: TemplateRef<any>;
  @ViewChild("dataRevoke", { static: false }) public dataRevoke: TemplateRef<
    any
  >;

  public currentToken: string;

  constructor(protected injector: Injector) {
    super(injector);
    // this.data_type = "Sessions";
    this.init("token", "admin/tokens");
    this.initPaging(20, true);
    this.list();

    this.currentToken = this.auth.getToken();
  }

  public ngAfterViewInit(): void {
    this.columns = [];
    this.columns.push({
      name: "User",
      prop: "user",
      flexGrow: 0.8,
      cellTemplate: this.dataUser,
    });
    this.columns.push({ name: "IP", prop: "IP", flexGrow: 0.5 });
    this.columns.push({ name: "Location", prop: "location", flexGrow: 0.5 });
    this.columns.push({
      name: "Emitted",
      prop: "emitted",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Last access",
      prop: "last_access",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Expiration",
      prop: "expiration",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Copy",
      prop: "token",
      flexGrow: 0.2,
      cellTemplate: this.dataToken,
      sortable: false,
    });
    this.columns.push({
      name: "",
      prop: "id",
      flexGrow: 0.2,
      cellTemplate: this.dataRevoke,
      sortable: false,
    });
  }

  public copied(event) {
    if (event["isSuccess"]) {
      this.notify.showSuccess("Token successfully copied");
    }
  }
}
