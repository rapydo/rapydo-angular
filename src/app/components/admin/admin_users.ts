import {
  Component,
  ViewChild,
  TemplateRef,
  Input,
  Injector,
} from "@angular/core";

import { Subject } from "rxjs";
import { take } from "rxjs/operators";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";
import { ExcelService } from "@rapydo/services/excel";
import { AdminUser } from "@rapydo/types";
import { environment } from "@rapydo/../environments/environment";
import { format } from "date-fns";

@Component({
  templateUrl: "admin_users.html",
})
export class AdminUsersComponent extends BasePaginationComponent<AdminUser> {
  @ViewChild("dataActive", { static: false })
  public dataActive: TemplateRef<any>;
  @ViewChild("dataRoles", { static: false }) public dataRoles: TemplateRef<any>;
  @ViewChild("dataGroup", { static: false }) public dataGroup: TemplateRef<any>;
  @ViewChild("dataName", { static: false }) public dataName: TemplateRef<any>;
  @ViewChild("dataDate", { static: false }) public dataDate: TemplateRef<any>;
  @ViewChild("controlsCell", { static: false })
  public controlsCell: TemplateRef<any>;
  @ViewChild("emptyHeader", { static: false })
  public emptyHeader: TemplateRef<any>;

  constructor(protected injector: Injector, private excel: ExcelService) {
    super(injector);

    let endpoint = "/api/admin/users";

    this.init("user", endpoint, "AdminUsers");
    this.initPaging();
    this.list();
  }

  public list(): Subject<boolean> {
    const subject = super.list();

    subject.pipe(take(1)).subscribe((success: boolean) => {
      const now: Date = new Date();
      for (let user of this.data) {
        if (user.expiration) {
          user.expired = new Date(user.expiration) <= now;
        }
      }
    });

    return subject;
  }
  public ngAfterViewInit(): void {
    this.columns = [];
    this.columns.push({
      name: "",
      prop: "is_active",
      cellTemplate: this.dataActive,
      flexGrow: 0.1,
    });
    this.columns.push({ name: "Email", prop: "email", flexGrow: 1.0 });
    this.columns.push({
      name: "Full Name",
      prop: "surname",
      flexGrow: 1.0,
      cellTemplate: this.dataName,
    });

    this.columns.push({
      name: "Group",
      prop: "group",
      cellTemplate: this.dataGroup,
      flexGrow: 0.35,
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
      // sortable: false,
      comparator: this.rolesComparator.bind(this),
      flexGrow: 0.5,
    });
    this.columns.push({
      name: "First<br>Login",
      prop: "first_login",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Last<br>Login",
      prop: "last_login",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Password<br>Change",
      prop: "last_password_change",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "controls",
      prop: "controls",
      cellTemplate: this.controlsCell,
      headerTemplate: this.emptyHeader,
      sortable: false,
      flexGrow: 0.2,
      minWidth: 60,
    });
  }

  protected manipulate_post_fields(fields) {
    for (let idx in fields) {
      if (fields[idx].key == "password") {
        fields[idx].props["random_generation"] = true;
      }
    }
    return fields;
  }

  protected manipulate_put_fields(fields) {
    for (let idx in fields) {
      if (fields[idx].key == "password") {
        fields[idx].props["random_generation"] = true;
      }
    }
    return fields;
  }

  public rolesViewComparator(rolesA, rolesB): number {
    const a = rolesA["value"]["description"];
    const b = rolesB["value"]["description"];

    return a.localeCompare(b);
  }

  private rolesComparator(rolesA, rolesB): number {
    const A = rolesA
      .map((r) => r["description"])
      .sort()
      .join(",");
    const B = rolesB
      .map((r) => r["description"])
      .sort()
      .join(",");

    if (A === B) {
      return 0;
    }
    if (A < B) {
      return -1;
    }
    return 1;
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

      for (let role of d.roles.map((x) => x["description"])) {
        if (role.toLowerCase().indexOf(data_filter) !== -1) {
          return true;
        }
      }

      if (d.group.shortname.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }

      if (d.group.fullname.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }

      return false;
    });
  }

  download() {
    const m = format(new Date(), "yyyyMMdd_HHmmss");
    const filename = `${environment.projectName}_users_${m}.xlsx`;

    const headers = ["Name", "Surname", "Email", "Group", "Affiliation"];
    const additional_fields = [];

    // pre-calculate additional custom fields, if any:
    const custom = this.customization.custom_user_data();
    if (custom) {
      for (let d of this.unfiltered_data) {
        for (let field of custom) {
          if (field.prop in d) {
            if (!additional_fields.includes(field.prop)) {
              additional_fields.push(field.prop);
              const name = field.name.replace(/<.*>/, " ");
              headers.push(name);
            }
          }
        }
      }
    }

    const download_data = [];

    for (let d of this.unfiltered_data) {
      const row = [
        d.name,
        d.surname,
        d.email,
        d.group.shortname,
        d.group.fullname,
      ];

      for (let additional of additional_fields) {
        row.push(d[additional]);
      }

      download_data.push(row);
    }

    const workbook = this.excel.createWorkbook();
    this.excel.addWorksheet(workbook, "Users", headers, download_data);
    this.excel.saveAs(workbook, filename);
  }
}
