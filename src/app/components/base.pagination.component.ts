import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  Injector,
} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";
// import { FormlyConfig } from "@ngx-formly/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from "ngx-spinner";

import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";
import { FormlyService, Schema } from "@rapydo/services/formly";
import { FormModal } from "@rapydo/components/forms/form_modal";

import { ProjectOptions } from "@app/custom.project.options";

// === @swimlane/ngx-datatable/src/types/column-mode.type
enum ColumnMode {
  standard = "standard",
  flex = "flex",
  force = "force",
}
export interface Paging {
  page: number;
  itemsPerPage: number;
  numPages: number;
  dataLength: number;
}
export interface Confirmation {
  title: string;
  message: string;
}

@Component({
  template: ``,
})
export class BasePaginationComponent<T> implements OnInit, AfterViewChecked {
  protected api: ApiService;
  protected auth: AuthService;
  protected notify: NotificationService;
  protected modalService: NgbModal;
  protected formly: FormlyService;
  protected changeDetectorRef: ChangeDetectorRef;
  protected spinner: NgxSpinnerService;
  protected customization: ProjectOptions;

  public ColumnMode = ColumnMode;

  public resource_name: string;

  protected server_side_pagination: boolean = false;

  protected endpoint: string;

  protected modalRef: NgbModalRef;
  public form;
  public fields;
  public model;
  public modalTitle: string;

  public loading: boolean = false;
  public updating: boolean = false;
  public data: Array<T> = [];

  public columns: Array<any> = [];
  // Only used by the filter function
  protected data_filter: string;
  public unfiltered_data: Array<T>;

  public deleteConfirmation: Confirmation;

  public paging: Paging;
  public is_update: boolean = false;

  protected sort_by: string = null;
  protected sort_order: string = null;

  @ViewChild("tableWrapper", { static: false }) tableWrapper;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  private currentComponentWidth;

  constructor(protected injector: Injector) {
    this.api = injector.get(ApiService);
    this.auth = injector.get(AuthService);
    this.notify = injector.get(NotificationService);
    this.modalService = injector.get(NgbModal);
    this.formly = injector.get(FormlyService);
    this.changeDetectorRef = injector.get(ChangeDetectorRef);
    this.spinner = injector.get(NgxSpinnerService);
    this.customization = injector.get(ProjectOptions);
  }
  public init(res: string): void {
    this.resource_name = res;
    this.deleteConfirmation = this.getDeleteConfirmation(this.resource_name);
  }

  public ngOnInit(): void {}

  // https://github.com/swimlane/ngx-datatable/issues/193
  public ngAfterViewChecked(): void {
    // Check if the table size has changed,
    if (
      this.table &&
      this.table.recalculate &&
      this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth
    ) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.changeDetectorRef.detectChanges();
    }
  }

  /** DELETE MODAL WITH MESSAGE CONFIRMATION **/
  public getDeleteConfirmation(name): Confirmation {
    return {
      title: "Confirmation required",
      message:
        `<div class='card text-center'>
          <div class='card-body'>
          <h4 class='card-title'>Are you really sure you want to delete this ` +
        name +
        `?</h4>
          <p class='card-text'>This operation cannot be undone.</p>
          </div>
          </div>`,
    };
  }

  public updateFilter(event): void {
    if (event !== null) {
      this.data_filter = event.target.value.toLowerCase();
    }

    if (this.server_side_pagination) {
      this.list();
    } else {
      if (!this.unfiltered_data) {
        this.unfiltered_data = this.data;
      }

      this.data = this.filter(this.data_filter);
      this.post_filter();

      this.updatePaging(this.data.length);
    }
  }

  post_filter(): void {}

  filter(data_filter: string): Array<T> {
    console.warn("Filter function not implemented");
    return this.data;
  }

  /** PAGINATION **/
  protected initPaging(itemPerPage: number): Paging {
    this.paging = {
      page: 0,
      itemsPerPage: itemPerPage,
      numPages: 1,
      dataLength: 0,
    };

    if (this.server_side_pagination) {
      this.set_total_items();
    }

    return this.paging;
  }

  protected updatePaging(dataLen: number): Paging {
    this.paging.dataLength = dataLen;
    this.paging.numPages = Math.ceil(dataLen / this.paging.itemsPerPage);

    return this.paging;
  }

  /*
  To be used this way:
    <ngx-datatable
        [...]
        [externalPaging]="true"
        [count]="paging.dataLength"
        [limit]="paging.itemsPerPage"
        [offset]="paging.page"
        (page)="serverSidePagination($event)"
        (sort)="updateSort($event)"
        [...]
*/
  public serverSidePagination(event: any): void {
    this.paging.page = event.offset;
    this.list();
  }
  public updateSort(event: any): void {
    if (this.server_side_pagination) {
      this.sort_by = event.column.prop;
      this.sort_order = event.newValue;
      this.list();
    }
  }

  /** INTERACTION WITH APIs**/
  protected list() {
    return this.get(this.endpoint);
  }
  protected set_total_items(): void {
    let data = {
      get_total: true,
    };
    if (this.data_filter) {
      data["input_filter"] = this.data_filter;
    }
    this.api.get(this.endpoint, "", data).subscribe(
      (response) => {
        const t = response["total"] || 0;

        this.paging.dataLength = t;
        this.paging.numPages = Math.ceil(t / this.paging.itemsPerPage);
        if (this.paging.page > 0 && this.paging.page >= this.paging.numPages) {
          // change the page to be the last page
          this.paging.page = this.paging.numPages - 1;
          // list again the current page
          this.list();
        }
      },
      (error) => {
        this.notify.showError(error);
      }
    );
  }

  public remove(uuid) {
    return this.delete(this.endpoint, uuid);
  }

  public create() {
    return this.post(this.endpoint);
  }

  public update(row) {
    return this.put(row, this.endpoint);
  }

  public submit(): boolean {
    if (!this.form.valid) {
      this.updating = false;
      return false;
    }

    let apiCall;
    let type = "";

    if (this.model["_id"]) {
      let m = { ...this.model };
      delete m["_id"];
      apiCall = this.api.put(this.endpoint, this.model["_id"], m);
      type = "updated";
    } else {
      apiCall = this.api.post(this.endpoint, this.model);
      type = "created";
    }

    return apiCall.subscribe(
      (response) => {
        this.modalRef.close("");
        this.notify.showSuccess(
          "Confirmation: " + this.resource_name + " successfully " + type
        );
        this.list();
        return true;
      },
      (error) => {
        this.updating = false;
        this.notify.showError(error);
        return false;
      }
    );
  }

  protected form_customizer(form, type) {
    return form;
  }

  protected set_loading(): boolean {
    this.loading = true;
    this.spinner.show();
    return this.loading;
  }
  protected set_unloading(): boolean {
    this.loading = false;
    this.spinner.hide();
    return this.loading;
  }

  protected get_post_title() {
    return "Create a new " + this.resource_name;
  }

  protected get_put_title() {
    return "Update " + this.resource_name;
  }

  protected manipulate_post_fields(fields) {
    return fields;
  }

  protected manipulate_post_model(model) {
    return model;
  }

  protected manipulate_put_fields(fields) {
    return fields;
  }

  protected manipulate_put_model(model) {
    return model;
  }

  protected get(endpoint, data = null, namespace = "api") {
    let opt;
    if (namespace !== "api") {
      opt = { base: namespace };
    }

    if (this.server_side_pagination && data === null) {
      data = {
        page: this.paging.page + 1,
        size: this.paging.itemsPerPage,
      };

      if (this.sort_by) {
        data["sort_by"] = this.sort_by;
      }
      if (this.sort_order) {
        data["sort_order"] = this.sort_order;
      }
      if (this.data_filter) {
        data["input_filter"] = this.data_filter;
      }
    } else if (data === null) {
      data = {};
    }

    this.set_loading();
    return this.api.get<T[]>(endpoint, "", data, opt, "Sessions").subscribe(
      (response) => {
        this.data = response;
        this.unfiltered_data = this.data;
        if (this.server_side_pagination) {
          this.set_total_items();
        } else {
          this.updatePaging(this.data.length);
        }

        this.set_unloading();
        this.updating = false;

        return this.data;
      },
      (error) => {
        this.notify.showError(error);

        this.set_unloading();
        this.updating = false;
        return this.data;
      }
    );
  }

  protected delete(endpoint, uuid, namespace = "api") {
    let opt;
    if (namespace !== "api") {
      opt = { base: namespace };
    }

    return this.api.delete(endpoint, uuid, opt).subscribe(
      (response) => {
        this.notify.showSuccess(
          "Confirmation: " + this.resource_name + " successfully deleted"
        );
        this.list();
      },
      (error) => {
        this.notify.showError(error);
      }
    );
  }

  protected post(endpoint) {
    return this.api
      .post<Schema[]>(endpoint, { get_schema: true })
      .subscribe(
        (response) => {
          let data = this.formly.json2Form(response, {});
          data = this.form_customizer(data, "post");

          this.modalTitle = this.get_post_title();
          this.form = new FormGroup({});
          this.fields = this.manipulate_post_fields(data.fields);
          this.model = this.manipulate_post_model(data.model);
          this.modalRef = this.modalService.open(FormModal, {
            size: "lg",
            backdrop: "static",
          });
          this.modalRef.componentInstance.modalTitle = this.modalTitle;
          this.modalRef.componentInstance.updating = this.updating;
          this.modalRef.componentInstance.form = this.form;
          this.modalRef.componentInstance.fields = this.fields;
          this.modalRef.componentInstance.model = this.model;
          this.modalRef.componentInstance.backRef = this;
          this.modalRef.result.then(
            (result) => {},
            (reason) => {}
          );
        },
        (error) => {
          this.notify.showError(error);
        }
      );
  }

  protected put(row, endpoint) {
    let model_id;
    if (row.id) {
      model_id = row.id;
    } else if (row.uuid) {
      model_id = row.uuid;
    } else {
      this.notify.showError("Malformed request: ID not found");
      return false;
    }

    return this.api
      .put<Schema[]>(endpoint, model_id, { get_schema: true })
      .subscribe(
        // return this.api.post(endpoint, {'get_schema': true}).subscribe(
        (response) => {
          let data = this.formly.json2Form(response, row);
          data = this.form_customizer(data, "put");
          this.modalTitle = this.get_put_title();
          this.form = new FormGroup({});
          this.fields = this.manipulate_put_fields(data.fields);
          this.model = this.manipulate_put_model(data.model);
          // Extra for update:
          this.model["_id"] = model_id;
          this.is_update = true;
          this.modalRef = this.modalService.open(FormModal, {
            size: "lg",
            backdrop: "static",
          });
          this.modalRef.componentInstance.modalTitle = this.modalTitle;
          this.modalRef.componentInstance.updating = this.updating;
          this.modalRef.componentInstance.form = this.form;
          this.modalRef.componentInstance.fields = this.fields;
          this.modalRef.componentInstance.model = this.model;
          this.modalRef.componentInstance.backRef = this;

          this.is_update = true;
          this.modalRef.result.then(
            (result) => {
              this.is_update = false;
            },
            (reason) => {
              this.is_update = false;
            }
          );
        },
        (error) => {
          this.notify.showError(error);
        }
      );
  }

  /*
<ngx-datatable
    [...]
    (activate)="onDatatableActivate($event)"
    >
</ngx-datatable>
*/
  public onDatatableActivate(event: any) {
    if (event.type === "click") {
      event.cellElement.blur();
    }
  }
}
