import {
  Component,
  OnInit,
  AfterViewChecked,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  Injector,
} from "@angular/core";
import { Subscription } from "rxjs";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";
// import { FormlyConfig } from "@ngx-formly/core";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from "ngx-spinner";

import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { NotificationService } from "@rapydo/services/notification";
import { FormlyService } from "@rapydo/services/formly";
import { Schema, Paging, Total, Confirmation } from "@rapydo/types";
import { FormModal } from "@rapydo/components/forms/form_modal";
import { UUID } from "@rapydo/types";

import { ProjectOptions } from "@app/custom.project.options";

// === @swimlane/ngx-datatable/src/types/column-mode.type
enum ColumnMode {
  standard = "standard",
  flex = "flex",
  force = "force",
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

  private server_side_pagination: boolean = false;

  private endpoint: string;
  private data_type: string = null;

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
  protected init(res_name: string, endpoint: string, data_type: string): void {
    this.resource_name = res_name;
    this.endpoint = endpoint;
    this.data_type = data_type;
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
      this.data = this.filter(this.data_filter);
      this.post_filter();

      this.updatePaging(this.data.length);
    }
  }

  protected post_filter(): void {}

  /* istanbul ignore next */
  public filter(data_filter: string): Array<T> {
    console.warn("Filter function not implemented");
    return this.data;
  }

  /** PAGINATION **/
  protected initPaging(itemPerPage: number = 20, ssp: boolean = false): Paging {
    this.paging = {
      page: 0,
      itemsPerPage: itemPerPage,
      numPages: 1,
      dataLength: 0,
    };

    if (ssp) {
      this.server_side_pagination = true;
      // this.set_total_items();
    }

    return this.paging;
  }

  private updatePaging(dataLen: number): Paging {
    this.paging.dataLength = dataLen;
    this.paging.numPages = Math.ceil(dataLen / this.paging.itemsPerPage);

    return this.paging;
  }

  /*
  To be used this way:
    <ngx-datatable
        [...]
        [externalPaging]="true" << add this
        [count]="paging.dataLength" << add this
        [offset]="paging.page" << add this
        (page)="serverSidePagination($event)" << add this
        (sort)="updateSort($event)" << add this
        (activate)="onDatatableActivate($event)"
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
  public onDatatableActivate(event: any) {
    if (event.type === "click") {
      event.cellElement.blur();
    }
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

  protected form_customizer(form, type) {
    return form;
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

  /** INTERACTION WITH APIs**/
  protected set_total_items(): void {
    let data = {
      get_total: true,
    };
    if (this.data_filter) {
      data["input_filter"] = this.data_filter;
    }
    this.api
      .get<Total>(this.endpoint, "", data, { validationSchema: "Total" })
      .subscribe(
        (response) => {
          const t = response.total;

          this.paging.dataLength = t;
          this.paging.numPages = Math.ceil(t / this.paging.itemsPerPage);
          if (
            this.paging.page > 0 &&
            this.paging.page >= this.paging.numPages
          ) {
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

  public list(): Subscription {
    let opt = {};

    if (this.data_type) {
      opt["validationSchema"] = this.data_type;
    }

    let data = {};
    if (this.server_side_pagination) {
      data["page"] = this.paging.page + 1;
      data["size"] = this.paging.itemsPerPage;

      if (this.sort_by) {
        data["sort_by"] = this.sort_by;
      }
      if (this.sort_order) {
        data["sort_order"] = this.sort_order;
      }
      if (this.data_filter) {
        data["input_filter"] = this.data_filter;
      }
    }

    this.set_loading();
    return this.api.get<T[]>(this.endpoint, "", data, opt).subscribe(
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

  public remove(uuid: string): Subscription {
    return this.api.delete(this.endpoint + "/" + uuid).subscribe(
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

  public create() {
    return this.open_form();
  }

  public update(row) {
    return this.open_form(row);
  }

  private open_form(model = null) {
    let apiCall;
    let model_id;
    let type;

    if (model === null) {
      type = "post";
      model_id = null;
      apiCall = this.api.post<Schema[]>(this.endpoint, { get_schema: true });
      model = {};
    } else {
      type = "put";
      model_id = model.id || model.uuid || null;
      /* istanbul ignore if */
      if (model_id === null) {
        this.notify.showError("Malformed request: ID not found");
        return false;
      }
      apiCall = this.api.put<Schema[]>(this.endpoint + "/" + model_id, "", {
        get_schema: true,
      });
    }

    return apiCall.subscribe(
      (response) => {
        let data = this.formly.json2Form(response, model);

        data = this.form_customizer(data, type);

        this.form = new FormGroup({});

        if (type === "put") {
          this.modalTitle = this.get_put_title();
          this.fields = this.manipulate_put_fields(data.fields);
          this.model = this.manipulate_put_model(data.model);
          this.model["_id"] = model_id;
        } else {
          this.modalTitle = this.get_post_title();
          this.fields = this.manipulate_post_fields(data.fields);
          this.model = this.manipulate_post_model(data.model);
        }

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
      apiCall = this.api.put(this.endpoint + "/" + this.model["_id"], "", m);
      type = "updated";
    } else {
      apiCall = this.api.post<UUID>(this.endpoint, this.model);
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
}
