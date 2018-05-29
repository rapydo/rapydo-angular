import { Component, Input } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'navbar',
  providers: [ApiService],
  templateUrl: './navbar.html',
})
export class NavbarComponent {

	@Input() user: any;

	private modalRef: NgbModalRef;

	constructor(
			private modalService: NgbModal,
			private api: ApiService,
			private auth: AuthService,
		) { }

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
