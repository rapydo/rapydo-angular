import { Component, ViewChild, TemplateRef, Injector } from "@angular/core";

import { Group } from "@rapydo/types";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";

@Component({
  templateUrl: "./admin_groups.html",
})
export class AdminGroupsComponent extends BasePaginationComponent<Group> {
  @ViewChild("controlsCell", { static: false })
  public controlsCell: TemplateRef<any>;
  @ViewChild("membersCell", { static: false })
  public membersCell: TemplateRef<any>;
  @ViewChild("coordinatorsCell", { static: false })
  public coordinatorsCell: TemplateRef<any>;
  @ViewChild("emptyHeader", { static: false })
  public emptyHeader: TemplateRef<any>;

  constructor(protected injector: Injector) {
    super(injector);
    this.init("group", "/api/admin/groups", "Groups");
    this.initPaging();
    this.list();
  }

  public ngOnInit(): void {}
  public ngAfterViewInit(): void {
    this.columns = [
      { name: "Shortname", prop: "shortname", flexGrow: 0.5 },
      { name: "Fullname", prop: "fullname", flexGrow: 1.5 },
      {
        name: "Members",
        prop: "members",
        flexGrow: 0.3,
        cellTemplate: this.membersCell,
      },
      {
        name: "Coordinator(s)",
        prop: "coordinators",
        cellTemplate: this.coordinatorsCell,
        sortable: false,
        flexGrow: 1,
      },
      {
        name: "controls",
        prop: "controls",
        cellTemplate: this.controlsCell,
        headerTemplate: this.emptyHeader,
        sortable: false,
        flexGrow: 0.2,
        minWidth: 60,
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
