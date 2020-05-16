import {
  Component,
  ViewChild,
  TemplateRef,
  Input,
  Injector,
} from "@angular/core";

import { Session } from "@rapydo/services/auth";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";

import { environment } from "@rapydo/../environments/environment";

@Component({
  templateUrl: "sessions.html",
})
export class SessionsComponent extends BasePaginationComponent<Session> {
  @ViewChild("dataToken", { static: false }) public dataToken: TemplateRef<any>;
  @ViewChild("dataDate", { static: false }) public dataDate: TemplateRef<any>;
  @ViewChild("dataRevoke", { static: false }) public dataRevoke: TemplateRef<
    any
  >;

  public currentToken: string;
  protected endpoint = "tokens";

  constructor(protected injector: Injector) {
    super(injector);
    this.init("token");

    this.list();
    this.initPaging(20);

    this.currentToken = this.auth.getToken();
  }

  public ngAfterViewInit(): void {
    this.columns = [];
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
      name: "Close",
      prop: "id",
      flexGrow: 0.2,
      cellTemplate: this.dataRevoke,
    });
    this.columns.push({
      name: "Copy",
      prop: "token",
      flexGrow: 0.2,
      cellTemplate: this.dataToken,
    });
  }

  list() {
    return this.get(this.endpoint, null, "auth");
  }

  remove(uuid) {
    return this.delete(this.endpoint, uuid, "auth");
  }

  filter(data_filter) {
    return this.unfiltered_data.filter(function (d) {
      if (d.IP != null && d.IP.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (
        d.location != null &&
        d.location.toLowerCase().indexOf(data_filter) !== -1
      ) {
        return true;
      }
      if (d.token.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }

      return false;
    });
  }

  public copied(event) {
    if (event["isSuccess"]) {
      this.notify.showSuccess("Token successfully copied");
    }
  }
}
