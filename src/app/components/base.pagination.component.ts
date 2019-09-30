import { Component, OnInit, AfterViewChecked, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '@ngx-formly/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

// can be used to do this:
//this.myservice = AppModule.injector.get(MyService);
//import { AppModule } from '@rapydo/app.module';

import { ApiService } from '@rapydo/services/api';
import { AuthService } from '@rapydo/services/auth';
import { NotificationService} from '@rapydo/services/notification';
import { FormlyService } from '@rapydo/services/formly'

@Component({
  selector: 'base-component',
  providers: [ApiService, AuthService, NotificationService, FormlyService],
  templateUrl: './base.pagination.component.html'
})
export class BasePaginationComponent implements OnInit, AfterViewChecked {

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
  public rows: Array<any> = [];
  public columns: Array<any> = []
  // Only used by the filter function
  protected data_filter: any;
  protected unfiltered_data: Array<any>;

  public deleteConfirmation: any;

  public paging: any;
  public is_update: boolean = false;

  @ViewChild('tableWrapper', {static: false}) tableWrapper;
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  private currentComponentWidth;

  constructor(
    protected api: ApiService,
    protected auth: AuthService,
    protected notify: NotificationService,
    protected modalService: NgbModal,
    protected formly: FormlyService,
    protected changeDetectorRef: ChangeDetectorRef,
    ) {

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
    console.log("WARNING: server side update function not implemented")
  }

  updateSort(event) {

    console.log("WARNING: update sort function not implemented")
    console.log(event);
    if (this.server_side_filter) {
      this.server_side_update()
    } else {

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
    console.log("WARNING: filter function not implemented")
    return this.data;
  }

  /** PAGINATION **/
  protected initPaging(itemPerPage:number):any {
    this.paging = {
      "page": 1,
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

  public setPage(page:any) {
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
  protected list() { console.log("list: to be implemented") }
  protected set_total_items(): number { 
    let data = {
      'get_total': true
    }
    return this.api.get(this.counter_endpoint, "", data).subscribe(
      response => {
        let result = this.api.parseResponse(response.data);

        this.notify.extractErrors(response, this.notify.WARNING);

        let t = 0
        if ("total" in result) {
          t = result["total"];
        }

        this.paging["dataLength"] = t;
        this.paging["numPages"] = Math.ceil(t / this.paging["itemsPerPage"]);
        return t;

      }, error => {
          this.notify.extractErrors(error, this.notify.ERROR);
          return 0;
        }
      );
  }
  protected remove(uuid) { console.log("remove: to be implemented") }
  protected create() { console.log("create: to be implemented") }
  protected update(row, element=null) { console.log("update: to be implemented") }
  protected submit() { console.log("submit: to be implemented") }

  protected get(endpoint, data=null) {

    if (this.server_side_pagination && data == null) {
      data = {
        "currentpage": this.paging.page,
        "perpage": this.paging.itemsPerPage
      }
    } else if (data == null) {
      data = {}
    }

    this.loading = true;
    return this.api.get(endpoint, "", data).subscribe(
          response => {
        this.data = this.api.parseResponse(response.data);
        if (!this.server_side_pagination) {
              this.updatePaging(this.data.length);
        }
        this.changePage(this.paging.page, this.data);

        this.notify.extractErrors(response, this.notify.WARNING);
        this.loading = false;
        this.updating = false;

        if (this.server_side_pagination) {
          return this.data
        } else {
          return this.rows
        }
      }, error => {
            this.notify.extractErrors(error, this.notify.ERROR);
            this.loading = false;
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
        this.notify.extractErrors(error, this.notify.ERROR);
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
        let data = this.formly.json2Form(response.data, {});

        this.modalTitle = "Create a new " + this.resource_name;
        this.fields = data.fields;
        this.model = data.model;
        this.modalRef = this.modalService.open(formModal, {"size": 'lg', "backdrop": 'static'});
        this.modalRef.result.then((result) => {
          // console.log("Closed with: " + result);
        }, (reason) => {
          // console.log(`Dismissed ${this.getDismissReason(reason)}`);
        });
      }, error => {
        console.log("error retrieving schema")
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
        let data = this.formly.json2Form(response.data, row);
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
        // console.log("Closed with: " + result);
        }, (reason) => {
          this.is_update = false;
        // console.log(`Dismissed ${this.getDismissReason(reason)}`);
        });
      }, error => {
            console.log("error retrieving schema")
          }
    );
  }

  protected send(endpoint) {
    if (this.form.valid) {

      let apiCall;
      let type = "";
      if (this.model["_id"]) {
        apiCall = this.api.put(endpoint, this.model["_id"], this.model);
        type = "updated";
      } else {
        apiCall = this.api.post(endpoint, this.model);
        type = "created";
      }

      apiCall.subscribe(
        response => {

          this.modalRef.close("");
          this.notify.showSuccess("Confirmation: " + this.resource_name + " successfully " + type);

          this.list();
        }, error => {
          this.updating = false;
          this.notify.extractErrors(error, this.notify.ERROR);
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
