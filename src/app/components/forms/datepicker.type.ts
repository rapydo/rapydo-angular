import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

@Component({
  selector: "formly-field-datepicker",
  template: `
    <div class="input-group">
      <input
        readonly
        class="form-control datepicker"
        [formControl]="formControl"
        [formlyAttributes]="field"
        ngbDatepicker
        [minDate]="to.min || { year: 1900, month: 1, day: 1 }"
        [maxDate]="to.max || { year: 2050, month: 12, day: 31 }"
        #d="ngbDatepicker"
        (click)="d.toggle()"
      />
      <div class="input-group-append" *ngIf="!to.required">
        <button class="btn btn-outline-danger" (click)="clear()" type="button">
          <i class="fas fa-xmark"></i>
        </button>
      </div>
      <div class="input-group-append">
        <button
          class="btn btn-outline-secondary"
          (click)="d.toggle()"
          type="button"
        >
          <i class="fas fa-calendar"></i>
        </button>
      </div>
    </div>
  `,
})
export class DatePickerTypeComponent extends FieldType {
  public clear() {
    this.field.parent.formControl.get(String(this.field.key)).setValue(null);
  }
}
