import { Component, ViewChild, TemplateRef, Input, Injector } from '@angular/core';

import { BasePaginationComponent } from '@rapydo/components/base.pagination.component'

@Component({
  selector: 'admin-users',
  templateUrl: 'admin_users.html'
})
export class AdminUsersComponent extends BasePaginationComponent {

  @ViewChild('dataActive', { static: false }) public dataActive: TemplateRef<any>;
  @ViewChild('dataRoles', { static: false }) public dataRoles: TemplateRef<any>;
  @ViewChild('dataGroup', { static: false }) public dataGroup: TemplateRef<any>;
  @ViewChild('dataName', { static: false }) public dataName: TemplateRef<any>;
  @ViewChild('dataDate', { static: false }) public dataDate: TemplateRef<any>;
  @ViewChild('controlsCell', { static: false }) public controlsCell: TemplateRef<any>;
  @ViewChild('emptyHeader', { static: false }) public emptyHeader: TemplateRef<any>;
  @ViewChild('formModal', { static: false }) public formModal: TemplateRef<any>;

  // both very temporary, remove me!
  @ViewChild('view_sessions', { static: false }) public view_sessions: TemplateRef<any>;
  @Input() sessions:any;


  protected endpoint = 'admin/users'

  constructor(protected injector: Injector) {

    super(injector);
    this.init("user");

    this.list();
    this.initPaging(20);
  }

  public ngAfterViewInit(): void {

    this.columns = [];
    this.columns.push({name: '', prop: "is_active", cellTemplate: this.dataActive, flexGrow: 0.1});
    this.columns.push({name: 'Email', prop: "email", flexGrow: 1.0});
    /*this.columns.push({name: 'Name', prop: "name", flexGrow: 0.8});*/
    /*this.columns.push({name: 'Surname', prop: "surname", flexGrow: 0.8});*/
    this.columns.push({name: 'Name', prop: "surname", flexGrow: 1.0, cellTemplate: this.dataName});

    let user_page = this.customization.get_option('user_page');
    if (user_page !== null) {
      if (user_page["group"]) {
        this.columns.push({name: 'Group', prop: "_belongs_to", cellTemplate: this.dataGroup, flexGrow: 0.3});
      }

      if (user_page["custom"]) {

        for (let i=0; i<user_page["custom"].length; i++) {
          this.columns.push(user_page["custom"][i]);
        }
      }
    }

    this.columns.push({name: 'Roles', prop: "_roles", cellTemplate: this.dataRoles, flexGrow: 0.9});
    this.columns.push({name: 'First<br>Login', prop: "first_login", flexGrow: 0.5, cellTemplate: this.dataDate});
    this.columns.push({name: 'Last<br>Login', prop: "last_login", flexGrow: 0.5, cellTemplate: this.dataDate});
    this.columns.push({name: 'Password<br>Change', prop: "last_password_change", flexGrow: 0.5, cellTemplate: this.dataDate});
    this.columns.push({name: 'controls', prop: 'controls', cellTemplate: this.controlsCell, headerTemplate: this.emptyHeader, flexGrow: 0.2});
  }

  list() {
    return this.get(this.endpoint)
  }

  remove(uuid) {
    return this.delete(this.endpoint, uuid);
  }

  protected form_customizer(form, type) {
    if (type == 'put') {
      for (let k in form.fields) {
        if (form.fields[k].key == "email") {
          form.fields[k].templateOptions["readonly"] = true;
        }
      }
    }
    return form;
  }

  create() {
    let data = {'get_schema': true, 'autocomplete': false} 

    return this.post(this.endpoint, data, this.formModal, false);
  }

  update(row, element) {

    // workaroud to avoid the following error: 
    // ExpressionChangedAfterItHasBeenCheckedError
    // https://github.com/swimlane/ngx-datatable/issues/721
    // https://github.com/ng-bootstrap/ng-bootstrap/issues/1252
    // element is expected to be:
    //    the <i class='icon'>
    // element.parentElement is expected to be:
    //    <div class='datatable-body-cell' 
    // element.parentElement.parentElement is expected to be:
    //     <datatable-body-cell
    if (element && 
        element.parentElement && 
          element.parentElement.parentElement) {
      element.parentElement.parentElement.blur();
    }

    let data = {'get_schema': true, 'autocomplete': false} 
    if (row._roles) {
      for (let i=0; i<row._roles.length; i++) {
        let n = row._roles[i].name;
        row["roles_" + n] = true;
      }
    }

    return this.put(row, this.endpoint, data, this.formModal, false);
  }

  submit() {
    // If created by admins, credentials  
    // must accept privacy at the login
    if (!this.model["_id"]) {
      this.model["privacy_accepted"] = false;
    }
    this.send(this.endpoint);
  }

  filter(data_filter) {
    return this.unfiltered_data.filter(function(d) {
      if (d.email.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.name.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.surname.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }

      return false;
    });
  }

  public show_sessions(user) {
    this.api.get("tokens", "", {'username': user.email}, {'base': 'auth'}).subscribe(
      response => {
        this.sessions = response;
        let modalRef = this.modalService.open(this.view_sessions, {"size": 'lg', "backdrop": 'static'});
        modalRef.result.then((result) => {
        }, (reason) => {
        });
      },
      error => {
        this.notify.showError(error);
      }
    );
  }

}
