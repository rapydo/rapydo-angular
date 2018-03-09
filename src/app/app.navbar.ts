import { Component, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'navbar',
  template: require('/app/frontend/app/app.navbar.html'),
})
export class NavbarComponent {

	@Input() user: any;

	public myproject: string

	constructor(private modalService: NgbModal) { 
		var t = process.env.projectTitle;
		t = t.replace(/^'/, "");
		t = t.replace(/'$/, "");
		this.myproject = t; 
	}

	logout(content) {
	    this.modalService.open(content).result.then((result) => {
	      console.log("Closed with: ${result}");
	    }, (reason) => {
	    	console.log(`Dismissed ${this.getDismissReason(reason)}`);
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
