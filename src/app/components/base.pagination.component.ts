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
@Component({
  selector: 'base-component',
  templateUrl: 'base.pagination.component.html'
})
export class BasePaginationComponent implements OnInit, AfterViewChecked {

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

  protected server_side_filter = false;
  protected server_side_sort = false;
  protected server_side_pagination = false;

  protected endpoint: string;
  protected counter_endpoint: string;

  protected modalRef: NgbModalRef;
  public form = new FormGroup({});
  public fields: FormlyConfig[]; 
  public model:any = {}
  public modalTitle: string;

  public loading:boolean = false;
  public updating:boolean = false;
  public data: Array<any> = [];
  // rows is no longer required?
  public rows: Array<any> = [];

  public columns: Array<any> = []
  // Only used by the filter function
  protected data_filter: any;
  public unfiltered_data: Array<any>;

  public deleteConfirmation: any;

  public paging: any;
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
  public init(res:string) {

    this.resource_name = res;
    this.deleteConfirmation = this.getDeleteConfirmation(this.resource_name);
  }

  public ngOnInit(): void { }

  // https://github.com/swimlane/ngx-datatable/issues/193
  public ngAfterViewChecked() {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      this.changeDetectorRef.detectChanges();
    }
  }

  /** DELETE MODAL WITH MESSAGE CONFIRMATION **/
  public getDeleteConfirmation(name) {
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


  protected server_side_update() {
    console.warn("Server side update function not implemented")
  }

  updateSort(event) {

    console.warn("Update sort function not implemented")
    if (this.server_side_filter) {
      this.server_side_update()
    }
  }

  updateFilter(event) {

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

      this.changePage(1, this.data);
    }
  }

  post_filter() {}

  filter(data_filter) {
    console.warn("Filter function not implemented")
    return this.data;
  }

  /** PAGINATION **/
  protected initPaging(itemPerPage:number):any {
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

  protected updatePaging(dataLen:number): any {
    this.paging["dataLength"] = dataLen;
    this.paging["numPages"] = Math.ceil(dataLen / this.paging["itemsPerPage"]);

    return this.paging;
  }

  protected changePage(page:number, data:Array<any>): Array<any> {

    if (page > 1) {
      console.warn("Deprecated paging change");
    }

    this.paging.page = page;
    if (this.server_side_pagination) {
      this.rows = this.data;
    } else {
      let start = (this.paging.page - 1) * this.paging.itemsPerPage;
      let end = this.paging.itemsPerPage > -1 ? (start + this.paging.itemsPerPage): data.length;
      this.rows = data.slice(start, end);
    }
    return this.rows;
  }
/*
  To used this:
    <ngx-datatable
        [...]
        [externalPaging]="true"
        [count]="paging.dataLength"
        [limit]="paging.itemsPerPage"
        [offset]="paging.page"
        (page)="serverSidePagination($event)"
        [...]
*/
  public serverSidePagination(event:any) {

    this.paging.page = event.offset;
    this.list();

  }

  public setPage(page:any) {

    console.warn("Deprecated paging set");
    this.paging.page = page;

    if (this.server_side_sort) {
      this.server_side_update();
    } else if (this.server_side_pagination) {
      this.list();
    } else {
      this.changePage(page, this.data);
    }
  }

  /** INTERACTION WITH APIs**/
  protected list() { console.warn("Listing not implemented") }
  protected set_total_items(): number { 
    let data = {
      'get_total': true
    }
    return this.api.get(this.counter_endpoint, "", data).subscribe(
      response => {
        
        if (environment.WRAP_RESPONSE == '1') response = response.data;
        let result = this.api.parseResponse(response);

        let t = 0
        if ("total" in result) {
          t = result["total"];
        }

        this.paging["dataLength"] = t;
        this.paging["numPages"] = Math.ceil(t / this.paging["itemsPerPage"]);
        return t;

      }, error => {
          if (environment.WRAP_RESPONSE == '1')
            if (error.Response) this.notify.showError(error.Response.errors);
            else this.notify.showError(error);
          else {
            this.notify.showError(error);
          }
          return 0;
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

  protected set_loading() {
    this.loading = true;
    this.spinner.show()
  }
  protected set_unloading() {
    this.loading = false;
    this.spinner.hide();
  }

  protected get(endpoint, data=null) {

    if (this.server_side_pagination && data == null) {
      data = {
        "currentpage": this.paging.page + 1,
        "perpage": this.paging.itemsPerPage
      }
    } else if (data == null) {
      data = {}
    }

    this.set_loading()
    return this.api.get(endpoint, "", data).subscribe(
      response => {
        if (environment.WRAP_RESPONSE == '1') response = response.data;
        this.data = this.api.parseResponse(response);
        this.unfiltered_data = this.data;
        if (!this.server_side_pagination) {
          this.updatePaging(this.data.length);
          this.changePage(this.paging.page, this.data);
        }

        this.set_unloading();
        this.updating = false;

        if (this.server_side_pagination) {
          return this.data
        } else {
          return this.rows
        }
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

  protected delete(endpoint, uuid) {
    return this.api.delete(endpoint, uuid).subscribe(
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

    let apiCall = null;
    if (base_schema) {
      apiCall = this.api.get(endpoint)
    } else {
      apiCall = this.api.post(endpoint, data)
    }

    return apiCall.subscribe(
      response => {
        if (environment.WRAP_RESPONSE == '1') response = response.data;
        let data = this.formly.json2Form(response, row);
        data = this.form_customizer(data, "put")
        this.modalTitle = "Update " + this.resource_name;
        this.fields = data.fields;
        this.model = data.model;
        // Extra for update:
        this.model["_id"] = row.id;
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
        apiCall = this.api.put(endpoint, model["_id"], model);
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
