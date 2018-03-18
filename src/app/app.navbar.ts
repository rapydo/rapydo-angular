import { Component, Input } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './api.service';
import { AuthService } from './app.auth.service';

@Component({
  selector: 'navbar',
  providers: [ApiService],
  templateUrl: './app.navbar.html',
})
export class NavbarComponent {

	@Input() user: any;

	public myproject: string
	private modalRef: NgbModalRef;


	constructor(
			private modalService: NgbModal,
			private api: ApiService,
			private auth: AuthService,
		) { 
		var t = process.env.projectTitle;
		t = t.replace(/^'/, "");
		t = t.replace(/'$/, "");
		this.myproject = t; 

/*		
		this.api.get('default_fields').subscribe(
			test => console.log(test)
		);
*/

	}

	do_logout() {
		this.auth.logout().subscribe(
			response =>  {
				this.modalRef.close("");
			}
		);
	}
	ask_logout(content) {
	    this.modalRef = this.modalService.open(content, {size: 'lg'});
	    this.modalRef.result.then((result) => {
			/*console.log("Closed with: " + result)*/;
	    }, (reason) => {
			/*console.log(`Dismissed ${this.getDismissReason(reason)}`)*/;
	    });
	}

	private getDismissReason(reason: any): string {
	    if (reason === ModalDismissReasons.ESC) {
	      return 'by pressing ESC';
	    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
	      return 'by clicking on a backdrop';
	    } else {
	      return  `with: ${reason}`;
	    }
	}

}
