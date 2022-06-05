import { Component, OnInit } from "@angular/core";
import { FormlyFieldCheckbox } from "@ngx-formly/bootstrap/checkbox";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "formly-field-terms_of_use_checkbox",
  // Copied from
  // https://github.com/ngx-formly/ngx-formly/blob/main/src/ui/bootstrap/checkbox/src/checkbox.type.ts
  // changed to add link to acceptation
  // removed <ng-template #fieldTypeTemplate>,
  //    because bs5 does not support floating labels for checkboxes
  template: `
    <div
      class="form-check"
      [ngClass]="{
        'form-check-inline':
          props.formCheck === 'inline' || props.formCheck === 'inline-switch',
        'form-switch':
          props.formCheck === 'switch' || props.formCheck === 'inline-switch'
      }"
    >
      <input
        type="checkbox"
        [class.is-invalid]="showError"
        class="form-check-input"
        [class.position-static]="props.formCheck === 'nolabel'"
        [indeterminate]="props.indeterminate && formControl.value == null"
        [formControl]="formControl"
        [formlyAttributes]="field"
      />
      <label
        *ngIf="props.formCheck !== 'nolabel'"
        [for]="id"
        class="form-check-label"
      >
        {{ props.label }}
        <span
          *ngIf="props.required && props.hideRequiredMarker !== true"
          aria-hidden="true"
          >*</span
        >
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

      <div class="modal-body" [innerHTML]="terms_of_use"></div>

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
  public terms_of_use: string = "";

  constructor(private modalService: NgbModal) {
    super();
  }

  public ngOnInit(): void {
    // @ts-ignore
    this.terms_of_use = this.to.terms_of_use || "";
  }

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
