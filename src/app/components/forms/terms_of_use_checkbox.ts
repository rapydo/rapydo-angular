import { Component, OnInit } from "@angular/core";
import { FormlyFieldCheckbox } from "@ngx-formly/bootstrap";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "formly-field-terms_of_use_checkbox",
  // Copied from
  // https://github.com/formly-js/ngx-formly/blob/master/src/bootstrap/src/lib/types/checkbox.ts
  // changed to add link to acceptation
  template: `
    <div class="custom-control custom-checkbox">
      <input
        class="custom-control-input"
        type="checkbox"
        [id]="id"
        [class.is-invalid]="showError"
        [indeterminate]="to.indeterminate && model.get(key) === null"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <label class="custom-control-label" [for]="id">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
      </label>
      <a (click)="open(content)">
        ( <i class="fas fa-external-link-alt"></i> read)
      </a>
    </div>

    <ng-template #content let-c="close" let-d="dismiss">
      <div class="modal-header">
        <h4 class="modal-title" id="modal-basic-title">{{ to.label }}</h4>
      </div>

      <div class="modal-body" [innerHTML]="to.terms_of_use"></div>

      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-dark"
          (click)="c('Save click')"
        >
          I read it
        </button>
      </div>
    </ng-template>
    <br />
  `,
})
export class TermsOfUseCheckbox extends FormlyFieldCheckbox implements OnInit {
  constructor(private modalService: NgbModal) {
    super();
  }

  public ngOnInit(): void {}

  open(content) {
    this.modalService
      .open(content, { size: "lg", backdrop: "static", keyboard: false })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
