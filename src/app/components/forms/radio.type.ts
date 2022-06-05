import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/bootstrap/form-field";

@Component({
  selector: "formly-field-radio",

  // copied from
  // https://github.com/ngx-formly/ngx-formly/blob/main/src/ui/bootstrap/radio/src/radio.type.ts
  // removed pipe | formlySelectOptions:field | async (used to resolve observables?)
  // added description muted
  template: `
    <ng-template #fieldTypeTemplate>
      <div
        *ngFor="let option of props.options; let i = index"
        class="form-check"
        [class.form-check-inline]="props.formCheck === 'inline'"
      >
        <input
          type="radio"
          [id]="id + '_' + i"
          class="form-check-input"
          [name]="field.name || id"
          [class.is-invalid]="showError"
          [attr.value]="option.value"
          [value]="option.value"
          [formControl]="formControl"
          [formlyAttributes]="field"
          [attr.disabled]="
            option.disabled || formControl.disabled ? true : null
          "
        />
        <label class="form-check-label" [for]="id + '_' + i">
          {{ option.label }}
        </label>
        <small
          *ngIf="option.description"
          class="radio-description form-text text-muted"
        >
          {{ option.description }}
        </small>
      </div>
    </ng-template>
  `,
})
export class RadioTypeComponent extends FieldType {}
