
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { ApiService } from '/rapydo/src/app/services/api';
import { NotificationService} from '/rapydo/src/app/services/notification';

@Component({
  selector: 'admin-users',
  providers: [ApiService, NotificationService],
  templateUrl: './admin_users.html'
})
export class AdminUsersComponent implements OnInit {

	@ViewChild('dataRoles') public dataRoles: TemplateRef<any>;
	@ViewChild('dataGroup') public dataGroup: TemplateRef<any>;

	private loading:boolean = false;
	private data: Array<any> = [];
	private rows: Array<any> = [];
	private columns: Array<any> = []
	private page:number = 1;
	private itemsPerPage:number = 20;
	private numPages:number = 1;
	private dataLength:number = 0;

	constructor(private api: ApiService, private notify: NotificationService) {}

	public ngOnInit(): void {

		this.list();

		this.columns = [
	        {name: 'Email', prop: "email"},
	        {name: 'Name', prop: "name"},
	        {name: 'Surname', prop: "surname"},
	        {name: 'Group', prop: "_belongs_to", cellTemplate: this.dataGroup},
	        {name: 'Roles', prop: "_roles", cellTemplate: this.dataRoles},
		];
	}

	list() {

		this.loading = true;
		this.api.get('admin/users').subscribe(
      		response => {

				this.data = this.api.parseResponse(response.data);
				this.dataLength = this.data.length;
				this.numPages = Math.ceil(this.dataLength / this.itemsPerPage);
				this.rows = this.changePage(this.data);
				console.log(this.data);
				this.notify.extractErrors(response, this.notify.WARNING);
				this.loading = false;
			}, error => {
				console.log(error);
      			this.notify.extractErrors(error, this.notify.ERROR);
      			this.loading = false;
      		}
  		);

	}

	changePage(data:Array<any>): Array<any> {
		let start = (this.page - 1) * this.itemsPerPage;
		let end = this.itemsPerPage > -1 ? (start + this.itemsPerPage): data.length;
		return data.slice(start, end);
	}

	setPage(page:any) {
		this.page = page;
		this.rows = this.changePage(this.data);
	}

}
