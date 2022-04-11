import { Component, OnInit } from "@angular/core";
import { FormlyFieldCheckbox } from "@ngx-formly/bootstrap/checkbox";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

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
        [indeterminate]="to.indeterminate"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <label class="custom-control-label" [for]="id">
        {{ to.label }}
        <span *ngIf="to.required && to.hideRequiredMarker !== true">*</span>
      </label>
      <a (click)="open(content)">
        ( <i class="fas fa-up-right-from-square"></i> read)
      </a>
      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        Acceptance is mandatory
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>
    </div>

    <ng-template #content let-c="close" let-d="dismiss">
      <div class="modal-header">
        <h1 class="modal-title" id="modal-basic-title">{{ to.label }}</h1>
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
export class TermsOfUseTypeComponent
  extends FormlyFieldCheckbox
  implements OnInit
{
  constructor(private modalService: NgbModal) {
    super();
  }

  public ngOnInit(): void {}

  // NgbModal.open is annotated as:
  // (content: any, options: NgbModalOptions = {}): NgbModalRef {
  open(content: any): NgbModalRef {
    return this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
    });
  }
}
