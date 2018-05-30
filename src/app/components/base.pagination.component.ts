
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '@ngx-formly/core';

import { ApiService } from '/rapydo/src/app/services/api';
import { AuthService } from '/rapydo/src/app/services/auth';
import { NotificationService} from '/rapydo/src/app/services/notification';
import { FormlyService } from '/rapydo/src/app/services/formly'

@Component({
  selector: 'base-component',
  providers: [ApiService, AuthService, NotificationService, FormlyService],
  templateUrl: './base.pagination.component.html'
})
export class BasePaginationComponent implements OnInit {

	protected modalRef: NgbModalRef;
	protected form = new FormGroup({});
	protected fields: FormlyConfig[]; 
	protected model:any = {}
	protected modalTitle: string;

	protected loading:boolean = false;
	protected data: Array<any> = [];
	protected rows: Array<any> = [];
	protected columns: Array<any> = []

	protected deleteConfirmation: any;

	public paging: any;

	constructor(
		protected resource_name:string,
		protected api: ApiService,
		protected auth: AuthService,
		protected notify: NotificationService,
		protected modalService: NgbModal,
		protected formly: FormlyService,
		) {

		this.deleteConfirmation = this.getDeleteConfirmation(resource_name);
	}
	public ngOnInit(): void { console.log("To be implemented")}

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

	/** PAGINATION **/
	protected initPaging(itemPerPage:number):any {
		this.paging = {
			"page": 1,
			"itemsPerPage": itemPerPage,
			"numPages": 1,
			"dataLength": 0
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
		let start = (this.paging.page - 1) * this.paging.itemsPerPage;
		let end = this.paging.itemsPerPage > -1 ? (start + this.paging.itemsPerPage): data.length;
		return data.slice(start, end);
	}

	protected setPage(page:any) {
		this.rows = this.changePage(page, this.data);
	}

	/** INTERACTION WITH APIs**/
	protected list() { console.log("To be implemented") }
	protected remove(uuid) { console.log("To be implemented") }
	protected create() { console.log("To be implemented") }
	protected update(row) { console.log("To be implemented") }
	protected submit(data) { console.log("To be implemented") }

	protected get(endpoint) {

		this.loading = true;
		return this.api.get(endpoint).subscribe(
      		response => {
				this.data = this.api.parseResponse(response.data);
      			this.updatePaging(this.data.length);
				this.rows = this.changePage(1, this.data);

				this.notify.extractErrors(response, this.notify.WARNING);
				this.loading = false;
			}, error => {
				console.log(error);
      			this.notify.extractErrors(error, this.notify.ERROR);
      			this.loading = false;
      		}
  		);
	}

	protected delete(endpoint, uuid) {
		return this.api.delete(endpoint, uuid).subscribe(
			response => {

				this.notify.showSuccess("Confirmation: "+this.resource_name+" successfully deleted");
				this.list();
			}, error => {
				this.notify.extractErrors(error, this.notify.ERROR);
			}
		);
	}
	protected post(endpoint, data, formModal) {

		return this.api.post(endpoint, data).subscribe(
			response => {
				let data = this.formly.json2Form(response.data, {}, this);

				this.modalTitle = "Create a new " + this.resource_name;
				this.fields = data.fields;
				this.model = data.model;
			    this.modalRef = this.modalService.open(formModal, {size: 'lg'});
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

	protected put(row, endpoint, data, formModal) {

		this.api.post(endpoint, data).subscribe(
			response => {
				let data = this.formly.json2Form(response.data, row, undefined);
				this.modalTitle = "Update " + this.resource_name;
				this.fields = data.fields;
				this.model = data.model;
				// Extra for update:
				this.model["_id"] = row.id;
			    this.modalRef = this.modalService.open(formModal, {size: 'lg'});
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

	protected send(data, endpoint) {
		if (this.form.valid) {

			var apiCall;
			var type = "";
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
					this.notify.showSuccess(this.resource_name + " successfully " + type);

					this.list();
				}, error => {
					this.notify.extractErrors(error, this.notify.ERROR);
				}
			);
		}
	}

}
