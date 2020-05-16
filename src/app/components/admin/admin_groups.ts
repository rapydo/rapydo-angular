import { Component, ViewChild, TemplateRef, Injector } from "@angular/core";

import { Group } from "@rapydo/services/auth";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";

@Component({
  templateUrl: "./admin_groups.html",
})
export class AdminGroupsComponent extends BasePaginationComponent<Group> {
  @ViewChild("dataCoordinator", { static: false })
  public dataCoordinator: TemplateRef<any>;
  @ViewChild("controlsCell", { static: false })
  public controlsCell: TemplateRef<any>;
  @ViewChild("emptyHeader", { static: false }) public emptyHeader: TemplateRef<
    any
  >;

  protected endpoint = "admin/groups";

  constructor(protected injector: Injector) {
    super(injector);
    this.init("group");

    this.list();
    this.initPaging(20);
  }

  public ngOnInit(): void {}
  public ngAfterViewInit(): void {
    this.columns = [
      { name: "Shortname", prop: "shortname", flexGrow: 0.5 },
      { name: "Fullname", prop: "fullname", flexGrow: 1.5 },
      {
        name: "Coordinator",
        prop: "coordinator",
        cellTemplate: this.dataCoordinator,
        flexGrow: 1.0,
      },
      {
        name: "controls",
        prop: "controls",
        cellTemplate: this.controlsCell,
        headerTemplate: this.emptyHeader,
        flexGrow: 0.2,
      },
    ];
  }

  filter(data_filter) {
    return this.unfiltered_data.filter(function (d) {
      if (d.shortname.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.fullname.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      return false;
    });
  }
}
