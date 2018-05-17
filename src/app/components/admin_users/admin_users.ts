
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { FormlyConfig } from '@ngx-formly/core';

import { ApiService } from '/rapydo/src/app/services/api';
import { AuthService } from '/rapydo/src/app/services/auth';
import { NotificationService} from '/rapydo/src/app/services/notification';
import { FormlyService } from '/rapydo/src/app/services/formly'
import { TemplatingService} from '/rapydo/src/app/services/templating';

@Component({
  selector: 'admin-users',
  providers: [ApiService, AuthService, NotificationService, TemplatingService, FormlyService],
  templateUrl: './admin_users.html'
})
export class AdminUsersComponent implements OnInit {

	@ViewChild('dataRoles') public dataRoles: TemplateRef<any>;
	@ViewChild('dataGroup') public dataGroup: TemplateRef<any>;
	@ViewChild('controlsCell') public controlsCell: TemplateRef<any>;
	@ViewChild('emptyHeader') public emptyHeader: TemplateRef<any>;
	@ViewChild('formModal') public formModal: TemplateRef<any>;

	private modalRef: NgbModalRef;
	private form = new FormGroup({});
	private fields: FormlyConfig[]; 
	private model:any = {}
	private modalTitle: string;

	private loading:boolean = false;
	private data: Array<any> = [];
	private rows: Array<any> = [];
	private columns: Array<any> = []

	private deleteConfirmation: any;


	constructor(
		private api: ApiService,
		private auth: AuthService,
		private notify: NotificationService,
		private templating: TemplatingService,
		private modalService: NgbModal,
		private formly: FormlyService,
		) {

		this.list();
		this.deleteConfirmation = templating.getDeleteConfirmation("field");
		templating.initPaging(20);
	}

	public ngOnInit(): void {

		this.columns = [
	        {name: 'Email', prop: "email", flexGrow: 1.3},
	        {name: 'Name', prop: "name", flexGrow: 1.0},
	        {name: 'Surname', prop: "surname", flexGrow: 1.0},
	        {name: 'Group', prop: "_belongs_to", cellTemplate: this.dataGroup, flexGrow: 0.4},
	        {name: 'Roles', prop: "_roles", cellTemplate: this.dataRoles, flexGrow: 1.0},
			{name: 'controls', prop: 'controls', cellTemplate: this.controlsCell, headerTemplate: this.emptyHeader, flexGrow: 0.2},
		];
	}

	list() {

		this.loading = true;
		this.api.get('admin/users').subscribe(
      		response => {
				this.data = this.api.parseResponse(response.data);
      			this.templating.updatePaging(this.data.length);
				this.rows = this.templating.changePage(1, this.data);

				this.notify.extractErrors(response, this.notify.WARNING);
				this.loading = false;
			}, error => {
				console.log(error);
      			this.notify.extractErrors(error, this.notify.ERROR);
      			this.loading = false;
      		}
  		);
	}

	setPage(page:any) {
		this.rows = this.templating.changePage(page, this.data);
	}

	create() {

		this.api.post("admin/users", {'get_schema': true, 'autocomplete': false}).subscribe(
			response => {
				let data = this.formly.json2Form(response.data, {}, this);
				this.modalTitle = "Create a new user";
				this.fields = data.fields;
				this.model = data.model;
			    this.modalRef = this.modalService.open(this.formModal, {size: 'lg'});
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

	delete(uuid) {
		this.api.delete('admin/users', uuid).subscribe(
			response => {
				this.notify.showSuccess("User successfully deleted");
				this.list();
			}, error => {
				this.notify.extractErrors(error, this.notify.ERROR);
			}
		);
	}

	update(row) {

		this.api.post("admin/users", {'get_schema': true, 'autocomplete': false}).subscribe(
			response => {
				let data = this.formly.json2Form(response.data, row, undefined);
				this.modalTitle = "Update user";
				this.fields = data.fields;
				this.model = data.model;
				// Extra for update:
				this.model["_id"] = row.id;
			    this.modalRef = this.modalService.open(this.formModal, {size: 'lg'});
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

	submit(data) {
		if (this.form.valid) {

			var apiCall;
			var type = "";
			if (this.model["_id"]) {
				apiCall = this.api.put(
					"admin/users", this.model["_id"], this.model);
				type = "updated";
			} else {
				apiCall = this.api.post(
					"admin/users", this.model);
				type = "created";
			}

			apiCall.subscribe(
				response => {

					this.modalRef.close("");
					this.notify.showSuccess("User successfully " + type);

					this.list();
				}, error => {
					this.notify.extractErrors(error, this.notify.ERROR);
				}
			);
		} else {
			console.log("Invalid form");
		}
	}

}
