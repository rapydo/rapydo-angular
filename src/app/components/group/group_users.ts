import {
  Component,
  ViewChild,
  TemplateRef,
  Input,
  Injector,
} from "@angular/core";

import { Subscription } from "rxjs";
import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";
import { Group, GroupUser, User } from "@rapydo/types";

@Component({
  templateUrl: "group_users.html",
})
export class GroupUsersComponent extends BasePaginationComponent<GroupUser> {
  @ViewChild("dataRoles", { static: false }) public dataRoles: TemplateRef<any>;
  @ViewChild("dataName", { static: false }) public dataName: TemplateRef<any>;

  public group: Group;
  constructor(protected injector: Injector) {
    super(injector);

    let endpoint = "group/users";

    let user: User = this.auth.getUser();
    if (user) {
      this.group = user.group;
    }
    this.init("user", endpoint, "GroupUsers");
    this.initPaging();
    this.list();
  }

  public ngAfterViewInit(): void {
    this.columns = [];
    this.columns.push({ name: "Email", prop: "email", flexGrow: 1.0 });
    this.columns.push({
      name: "Name",
      prop: "surname",
      flexGrow: 1.0,
      cellTemplate: this.dataName,
    });

    const custom = this.customization.custom_user_data();
    if (custom) {
      for (let field of custom) {
        this.columns.push(field);
      }
    }

    this.columns.push({
      name: "Roles",
      prop: "roles",
      cellTemplate: this.dataRoles,
      sortable: false,
      flexGrow: 0.5,
    });
  }

  filter(data_filter) {
    return this.unfiltered_data.filter(function (d) {
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
}
