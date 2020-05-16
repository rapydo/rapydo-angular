import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

@Component({
  selector: "formly-field-radio",

  // copied from https://github.com/ngx-formly/ngx-formly/blob/v5/src/bootstrap/src/lib/types/radio.ts
  // removed pipe | formlySelectOptions:field | async (used to resolve observables?)
  // removed dynamic classes from <label>
  // added description muted
  template: `
    <div>
      <div
        class="radio"
        *ngFor="let option of to.options; let i = index"
        [ngClass]="{
          'form-check': to.formCheck !== 'custom',
          'form-check-inline': to.formCheck === 'inline',
          'custom-control custom-radio': to.formCheck === 'custom'
        }"
      >
        <label class="custom-control custom-radio">
          <input
            type="radio"
            class="custom-control-input"
            [id]="id + '_' + i"
            [name]="id"
            [class.is-invalid]="showError"
            [attr.value]="option.value"
            [value]="option.value"
            [formControl]="formControl"
            [formlyAttributes]="field"
          />
          <span class="custom-control-label">
            {{ option.label }}
          </span>
          <small
            *ngIf="option.description"
            class="radio-description form-text text-muted"
          >
            {{ option.description }}
          </small>
        </label>
      </div>
    </div>
  `,
})
export class FormlyDescriptiveRadio extends FieldType {}
