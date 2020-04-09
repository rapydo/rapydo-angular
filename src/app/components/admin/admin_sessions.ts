import { Component, ViewChild, TemplateRef, Input, Injector } from '@angular/core';

import { BasePaginationComponent } from '@rapydo/components/base.pagination.component'

@Component({
  selector: 'admin-sessions',
  templateUrl: 'admin_sessions.html'
})
export class AdminSessionsComponent extends BasePaginationComponent {

  @ViewChild('dataToken', { static: false }) public dataToken: TemplateRef<any>;
  @ViewChild('dataDate', { static: false }) public dataDate: TemplateRef<any>;
  @ViewChild('dataRevoke', { static: false }) public dataRevoke: TemplateRef<any>;

  public currentToken: string;
  protected endpoint = 'admin/tokens'

  constructor(protected injector: Injector) {

    super(injector);
    this.init("tokens");

    this.list();
    this.initPaging(20);

    this.currentToken = this.auth.getToken();
  }

  public ngAfterViewInit(): void {

    this.columns = [];
    this.columns.push({name: 'User', prop: "user_email", flexGrow: 0.8});
    this.columns.push({name: 'IP', prop: "IP", flexGrow: 0.5});
    this.columns.push({name: 'Location', prop: "location", flexGrow: 0.5});
    this.columns.push({name: 'Emitted', prop: "emitted", flexGrow: 0.5, cellTemplate: this.dataDate});
    this.columns.push({name: 'Last access', prop: "last_access", flexGrow: 0.5, cellTemplate: this.dataDate});
    this.columns.push({name: 'Expiration', prop: "expiration", flexGrow: 0.5, cellTemplate: this.dataDate});
    this.columns.push({name: 'Close', prop: "id", flexGrow: 0.2, cellTemplate: this.dataRevoke});
    this.columns.push({name: 'Token', prop: "token", flexGrow: 0.2, cellTemplate: this.dataToken});
  }

  list() {
    return this.get(this.endpoint)
  }

  filter(data_filter) {
    return this.unfiltered_data.filter(function(d) {
      if (d.user_email.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.user_name.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.user_surname.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.IP.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.location.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.token.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }

      return false;
    });
  }


  remove(uuid) {
    return this.delete(this.endpoint, uuid);
  }

  public copied(event) {
    if (event['isSuccess']) {
      this.notify.showSuccess("Token successfully copied");
    }
  }

}
