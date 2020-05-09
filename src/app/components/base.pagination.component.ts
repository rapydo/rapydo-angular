import { Component, OnInit, AfterViewChecked, ViewChild, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '@ngx-formly/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from "ngx-spinner";

import { ApiService } from '@rapydo/services/api';
import { AuthService } from '@rapydo/services/auth';
import { NotificationService} from '@rapydo/services/notification';
import { FormlyService } from '@rapydo/services/formly'
import { ProjectOptions } from '@app/custom.project.options';

import { environment } from '@rapydo/../environments/environment';

// == @swimlane/ngx-datatable/src/types/column-mode.type
enum ColumnMode {
  standard = 'standard',
  flex = 'flex',
  force = 'force'
}
export interface Paging {
  page: number,
  itemsPerPage: number,
  numPages: number,
  dataLength: number
}
export interface Confirmation {
  title: string,
  message: string
}

@Component({
  template: ``
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

  public resource_name:string;

  protected server_side_filter:boolean = false;
  protected server_side_sort:boolean = false;
  protected server_side_pagination:boolean= false;

  protected endpoint: string;
  protected counter_endpoint: string;

  protected modalRef: NgbModalRef;
  public form;
  public fields; 
  public model;
  public modalTitle: string;

  public loading:boolean = false;
  public updating:boolean = false;
  public data: Array<T> = [];

  public columns: Array<any> = []
  // Only used by the filter function
  protected data_filter: string;
  public unfiltered_data: Array<T>;

  public deleteConfirmation: Confirmation;

  public paging: Paging;
  public is_update: boolean = false;

  @ViewChild('tableWrapper', {static: false}) tableWrapper;
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
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
  public init(res:string): void {

    this.resource_name = res;
    this.deleteConfirmation = this.getDeleteConfirmation(this.resource_name);
  }

  public ngOnInit(): void { }

  // https://github.com/swimlane/ngx-datatable/issues/193
  public ngAfterViewChecked(): void  {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.changeDetectorRef.detectChanges();
    }
  }

  /** DELETE MODAL WITH MESSAGE CONFIRMATION **/
  public getDeleteConfirmation(name): Confirmation {
    return {
      title: "Confirmation required",
      message:`<div class='card text-center'>
          <div class='card-body'>
          <h4 class='card-title'>Are you really sure you want to delete this ` + name +`?</h4>
          <p class='card-text'>This operation cannot be undone.</p>
          </div>
          </div>`
        }
  }


  protected server_side_update(): void {
    console.warn("Server side update function not implemented")
  }

  updateSort(event): void {

    console.warn("Update sort function not implemented")
    if (this.server_side_filter) {
      this.server_side_update()
    }
  }

  updateFilter(event): void {

    if (event != null) {
      this.data_filter = event.target.value.toLowerCase()
    }

    if (this.server_side_filter) {
      this.server_side_update()
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
    console.warn("Filter function not implemented")
    return this.data;
  }

  /** PAGINATION **/
  protected initPaging(itemPerPage:number): Paging {
    this.paging = {
      "page": 0,
      "itemsPerPage": itemPerPage,
      "numPages": 1,
      "dataLength": 0
    }


    if (this.server_side_pagination) {
      this.set_total_items();
    }

    return this.paging;
  }

  protected updatePaging(dataLen:number): Paging {
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
        [...]
*/
  public serverSidePagination(event: any): void {

    this.paging.page = event.offset;
    this.set_total_items();
    this.list();

  }

  /** INTERACTION WITH APIs**/
  protected list() { console.warn("Listing not implemented") }
  protected set_total_items(): void { 
    let data = {
      'get_total': true
    }
    this.api.get(this.counter_endpoint, "", data).subscribe(
      response => {
        
        if (environment.WRAP_RESPONSE == '1') response = response.data;

        const t = response["total"] || 0;

        this.paging.dataLength = t;
        this.paging.numPages = Math.ceil(t / this.paging.itemsPerPage);
        // page starts from 0 => if you are on a page after the last page
        if (this.paging.page >= this.paging.numPages) {
          // change the page to be the last page
          this.paging.page = this.paging.numPages - 1;
          // list again the current page
          this.list();
        }

      }, error => {
          if (environment.WRAP_RESPONSE == '1')
            if (error.Response) this.notify.showError(error.Response.errors);
            else this.notify.showError(error);
          else {
            this.notify.showError(error);
          }
        }
      );
  }
  protected remove(uuid) { console.warn("Remove not implemented") }
  protected create() { console.warn("Create not implemented") }
  protected update(row, element=null) { console.warn("Update not implemented") }
  protected submit() { console.warn("Submit not implemented") }

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

  protected get(endpoint, data=null, namespace='api') {

    let opt;
    if (namespace != 'api') {
      opt = {"base": namespace}
    }

    if (this.server_side_pagination && data == null) {
      data = {
        "currentpage": this.paging.page + 1,
        "perpage": this.paging.itemsPerPage
      }
    } else if (data == null) {
      data = {}
    }

    this.set_loading()
    return this.api.get(endpoint, "", data, opt).subscribe(
      response => {
        if (environment.WRAP_RESPONSE == '1') response = response.data;
        this.data = response;
        this.unfiltered_data = this.data;
        if (!this.server_side_pagination) {
          this.updatePaging(this.data.length);
        }

        this.set_unloading();
        this.updating = false;

        return this.data
      }, error => {
        if (environment.WRAP_RESPONSE == '1') {
          if (error.Response) this.notify.showError(error.Response.errors);
          else this.notify.showError(error);
        } else {
          this.notify.showError(error);
        }

        this.set_unloading();
        this.updating = false;
        return this.data;
      }
    );
  }

  protected delete(endpoint, uuid, namespace='api') {

    let opt;
    if (namespace != 'api') {
      opt = {"base": namespace}
    }

    return this.api.delete(endpoint, uuid, opt).subscribe(
      response => {

        this.notify.showSuccess("Confirmation: " + this.resource_name + " successfully deleted");
        this.list();
      }, error => {
        if (environment.WRAP_RESPONSE == '1') {
          if (error.Response) this.notify.showError(error.Response.errors);
          else this.notify.showError(error);
        } else {
          this.notify.showError(error);
        }
      }
    );
  }

  protected post(endpoint, data, formModal, base_schema) {

    let apiCall = null;
    if (base_schema) {
      apiCall = this.api.get(endpoint)
    } else {
      apiCall = this.api.post(endpoint, data)
    }

    return apiCall.subscribe(
      response => {
        if (environment.WRAP_RESPONSE == '1') response = response.data;
        let data = this.formly.json2Form(response, {});
        data = this.form_customizer(data, "post")

        this.modalTitle = "Create a new " + this.resource_name;
        this.form = new FormGroup({});
        this.fields = data.fields;
        this.model = data.model;
        this.modalRef = this.modalService.open(formModal, {"size": 'lg', "backdrop": 'static'});
        this.modalRef.result.then((result) => {
        }, (reason) => {
        });
      }, error => {
        if (environment.WRAP_RESPONSE == '1') {
          if (error.Response) this.notify.showError(error.Response.errors);
          else this.notify.showError(error);
        } else {
          this.notify.showError(error);
        }
      }
    );
  }

  protected put(row, endpoint, data, formModal, base_schema) {

    let model_id;
    if (row.id) {
      model_id = row.id;
    } else if (row.uuid) {
      model_id = row.uuid;
    } else {
      this.notify.showError("Malformed request: ID not found");
      return false;
    }

    let apiCall = null;
    if (base_schema) {
      apiCall = this.api.get(endpoint)
    } else {
      // apiCall = this.api.put(endpoint, model_id, data)
      apiCall = this.api.post(endpoint, data)
    }

    return apiCall.subscribe(
      response => {
        if (environment.WRAP_RESPONSE == '1') response = response.data;
        let data = this.formly.json2Form(response, row);
        data = this.form_customizer(data, "put")
        this.modalTitle = "Update " + this.resource_name;
        this.form = new FormGroup({});
        this.fields = data.fields;
        this.model = data.model;
        // Extra for update:
        this.model["_id"] = model_id;
        this.is_update = true;
        this.modalRef = this.modalService.open(formModal, {"size": 'lg', "backdrop": 'static'});
        this.is_update = true;
        this.modalRef.result.then((result) => {
          this.is_update = false;
        }, (reason) => {
          this.is_update = false;
        });
      }, error => {
        if (environment.WRAP_RESPONSE == '1') {
          if (error.Response) this.notify.showError(error.Response.errors);
          else this.notify.showError(error);
        } else {
          this.notify.showError(error);
        }
      }
    );
  }

  protected send(endpoint, data=null) {
    if (this.form.valid) {

      let apiCall;
      let type = "";

      let model = data || this.model;
      
      if (model["_id"]) {
        let m = {...model};
        delete m['_id'];
        apiCall = this.api.put(endpoint, model["_id"], m);
        type = "updated";
      } else {
        apiCall = this.api.post(endpoint, model);
        type = "created";
      }

      apiCall.subscribe(
        response => {

          this.modalRef.close("");
          this.notify.showSuccess("Confirmation: " + this.resource_name + " successfully " + type);

          this.list();
        }, error => {
          this.updating = false;
          if (environment.WRAP_RESPONSE == '1') {
            if (error.Response) this.notify.showError(error.Response.errors);
            else this.notify.showError(error);
          } else {
            this.notify.showError(error);
          }
        }
      );
    } else {
      this.updating = false;
    }
  }

  public onDatatableActivate(event: any) {
    if (event.type === 'click') {
        event.cellElement.blur();
    }
  }

}
