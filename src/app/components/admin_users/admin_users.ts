
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '/rapydo/src/app/services/api';
import { AuthService } from '/rapydo/src/app/services/auth';
import { NotificationService} from '/rapydo/src/app/services/notification';
import { FormlyService } from '/rapydo/src/app/services/formly'

import { BasePaginationComponent } from '/rapydo/src/app/components/base.pagination.component'

import { ProjectOptions } from '/app/frontend/app/custom.project.options';

@Component({
  selector: 'admin-users',
  providers: [ApiService, AuthService, NotificationService, FormlyService],
  templateUrl: './admin_users.html'
})
export class AdminUsersComponent extends BasePaginationComponent {

	@ViewChild('dataActive') public dataActive: TemplateRef<any>;
	@ViewChild('dataRoles') public dataRoles: TemplateRef<any>;
	@ViewChild('dataGroup') public dataGroup: TemplateRef<any>;
	@ViewChild('dataName') public dataName: TemplateRef<any>;
	@ViewChild('controlsCell') public controlsCell: TemplateRef<any>;
	@ViewChild('emptyHeader') public emptyHeader: TemplateRef<any>;
	@ViewChild('formModal') public formModal: TemplateRef<any>;

	protected endpoint = 'admin/users'

	constructor(
		protected api: ApiService,
		protected auth: AuthService,
		protected notify: NotificationService,
		protected modalService: NgbModal,
		protected formly: FormlyService,
        private customization: ProjectOptions
		) {

		super("user", api, auth, notify, modalService, formly);

		this.list();
		this.initPaging(20);
	}

	public ngOnInit(): void {

		this.columns = [];
        this.columns.push({name: '', prop: "is_active", cellTemplate: this.dataActive, flexGrow: 0.1});
		this.columns.push({name: 'Email', prop: "email", flexGrow: 1.0});
        /*this.columns.push({name: 'Name', prop: "name", flexGrow: 0.8});*/
        /*this.columns.push({name: 'Surname', prop: "surname", flexGrow: 0.8});*/
        this.columns.push({name: 'Name', prop: "surname", flexGrow: 1.0, cellTemplate: this.dataName});

        let user_page = this.customization.get_option('user_page');
        if (user_page !== null) {
        	if (user_page["group"]) {
		        this.columns.push({name: 'Group', prop: "_belongs_to", cellTemplate: this.dataGroup, flexGrow: 0.3});
		    }

		    if (user_page["custom"]) {

		    	for (let i=0; i<user_page["custom"].length; i++) {
		    		this.columns.push(user_page["custom"][i]);
		    	}
		    }
        }

        this.columns.push({name: 'Roles', prop: "_roles", cellTemplate: this.dataRoles, flexGrow: 0.9});
		this.columns.push({name: 'controls', prop: 'controls', cellTemplate: this.controlsCell, headerTemplate: this.emptyHeader, flexGrow: 0.2});
	}

	list() {
		return this.get(this.endpoint)
	}

	remove(uuid) {
		return this.delete(this.endpoint, uuid);
	}

	create() {
		let data = {'get_schema': true, 'autocomplete': false} 

		return this.post(this.endpoint, data, this.formModal, false);
	}

	update(row) {

		let data = {'get_schema': true, 'autocomplete': false} 
		if (row._roles) {
			for (let i=0; i<row._roles.length; i++) {
				let n = row._roles[i].name;
				row["roles_" + n] = true;
			}
		}

		return this.put(row, this.endpoint, data, this.formModal, false);
	}

	submit(data) {
		// If created by admins, credentials  
		// must accept privacy at the login
		if (!this.model["_id"]) {
			this.model["privacy_accepted"] = false;
		}
		this.send(data, this.endpoint);
	}

	filter(data_filter) {
		return this.unfiltered_data.filter(function(d) {
			if (d.email.toLowerCase().indexOf(data_filter) !== -1) {
				return true;
			}
			if (d.name.toLowerCase().indexOf(data_filter) !== -1) {
				return true;
			}
			if (d.surname.toLowerCase().indexOf(data_filter) !== -1) {
				return true;
			}

			return false;
		});
	}

}
