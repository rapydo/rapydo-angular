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
import { ConfirmationModals } from "@rapydo/services/confirmation.modals";
import { FormlyService } from "@rapydo/services/formly";
import { Schema, Paging, Total } from "@rapydo/types";
import { FormModal } from "@rapydo/components/forms/form_modal";
import { UUID } from "@rapydo/types";

import { ProjectOptions } from "@app/customization";

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
  protected confirmationModals: ConfirmationModals;
  protected modalService: NgbModal;
  protected formly: FormlyService;
  protected changeDetectorRef: ChangeDetectorRef;
  protected spinner: NgxSpinnerService;
  protected customization: ProjectOptions;

  public ColumnMode = ColumnMode;

  public resource_name: string;

  private server_side_pagination: boolean = false;
  private server_side_filtering: boolean = false;

  // Used for GET and POST...
  // but also the other methods if a resource_endpoint is not specified
  private endpoint: string;
  // Used for PUT and DELETE ... usually it matches endpoint
  private resource_endpoint: string;

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
  // Used by the filter function
  public data_filter: string;
  public data_filters: Record<string, unknown>;
  public unfiltered_data: Array<T>;

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
    this.confirmationModals = injector.get(ConfirmationModals);
    this.modalService = injector.get(NgbModal);
    this.formly = injector.get(FormlyService);
    this.changeDetectorRef = injector.get(ChangeDetectorRef);
    this.spinner = injector.get(NgxSpinnerService);
    this.customization = injector.get(ProjectOptions);
  }
  protected init(res_name: string, endpoint: string, data_type: string): void {
    this.resource_name = res_name;

    this.set_endpoint(endpoint);
    this.set_resource_endpoint(endpoint);

    this.data_type = data_type;
  }

  // Used for GET and POST... and PUT DELETE if a resource_endpoint is not specified
  protected set_endpoint(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Used for PUT and DELETE ... usually it matches endpoint
  protected set_resource_endpoint(endpoint: string) {
    this.resource_endpoint = endpoint;
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
      this.server_side_filtering = true;
      // this.set_total_items();
    }

    return this.paging;
  }
  protected setServerSideFiltering() {
    this.server_side_filtering = true;
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
    if (this.data_filters) {
      for (let k in this.data_filters) {
        if (this.data_filters[k] != null) {
          data[k] = this.data_filters[k];
        }
      }
    }
    if (this.data_filter) {
      data["input_filter"] = this.data_filter;
    }

    this.api
      .get<Total>(this.endpoint, data, { validationSchema: "Total" })
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
    }
    if (this.server_side_pagination || this.server_side_filtering) {
      if (this.data_filters) {
        for (let k in this.data_filters) {
          if (this.data_filters[k] != null) {
            data[k] = this.data_filters[k];
          }
        }
      }
      if (this.data_filter) {
        data["input_filter"] = this.data_filter;
      }
    }

    this.set_loading();
    return this.api.get<T[]>(this.endpoint, data, opt).subscribe(
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

  public delete(
    uuid: string,
    text: string = null,
    title: string = null,
    subText: string = null
  ): Subscription {
    if (text == null) {
      text = `Are you really sure you want to delete this ${this.resource_name}?`;
    }

    let retPromise: Subscription = null;
    this.confirmationModals
      .open({ text: text, title: title, subText: subText })
      .then(
        (result) => {
          retPromise = this.api
            .delete(`${this.resource_endpoint}/${uuid}`)
            .subscribe(
              (response) => {
                this.notify.showSuccess(
                  "Confirmation: " +
                    this.resource_name +
                    " successfully deleted"
                );
                this.list();
              },
              (error) => {
                this.notify.showError(error);
              }
            );
        },
        (reason) => {}
      );

    return retPromise;
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
      apiCall = this.api.put<Schema[]>(
        `${this.resource_endpoint}/${model_id}`,
        {
          get_schema: true,
        }
      );
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
      let model = { ...this.model };
      delete model["_id"];
      apiCall = this.api.put(
        `${this.resource_endpoint}/${this.model["_id"]}`,
        model
      );
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
