
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '/rapydo/src/app/services/api';
import { AuthService } from '/rapydo/src/app/services/auth';
import { NotificationService} from '/rapydo/src/app/services/notification';
import { FormlyService } from '/rapydo/src/app/services/formly'

import { BasePaginationComponent } from '/rapydo/src/app/components/base.pagination.component'

@Component({
  selector: 'admin-users',
  providers: [ApiService, AuthService, NotificationService, FormlyService],
  templateUrl: './admin_users.html'
})
export class AdminUsersComponent extends BasePaginationComponent {

	@ViewChild('dataRoles') public dataRoles: TemplateRef<any>;
	@ViewChild('dataGroup') public dataGroup: TemplateRef<any>;
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
		) {

		super("user", api, auth, notify, modalService, formly);

		this.list();
		this.initPaging(20);
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

		return this.put(row, this.endpoint, data, this.formModal, false);
	}

	submit(data) {
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
