import { Injectable } from '@angular/core';

@Injectable()
export class TemplatingService {

	public paging: any;

	constructor() {}

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

	public initPaging(itemPerPage:number):any {
		this.paging = {
			"page": 1,
			"itemsPerPage": itemPerPage,
			"numPages": 1,
			"dataLength": 0
		}

		return this.paging;
	}

	public updatePaging(dataLen:number): any {
		this.paging["dataLength"] = dataLen;
		this.paging["numPages"] = Math.ceil(dataLen / this.paging["itemsPerPage"]);

		return this.paging;
	}

	public changePage(page:number, data:Array<any>): Array<any> {
		this.paging.page = page;
		let start = (this.paging.page - 1) * this.paging.itemsPerPage;
		let end = this.paging.itemsPerPage > -1 ? (start + this.paging.itemsPerPage): data.length;
		return data.slice(start, end);
	}

}
