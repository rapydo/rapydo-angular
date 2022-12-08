import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/bootstrap/form-field";

@Component({
  selector: "formly-field-datepicker",
  template: `
    <ng-template #fieldTypeTemplate>
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
        <div
          class="input-group-text clickable"
          (click)="clear()"
          *ngIf="!to.required"
          ngbTooltip="Clear the current date selection"
        >
          <i class="fas fa-calendar-minus red clickable"></i>
        </div>
        <div
          class="input-group-text clickable"
          (click)="d.toggle()"
          ngbTooltip="Pick a date from the calendar"
        >
          <i class="fas fa-calendar-plus clickable"></i>
        </div>
      </div>
    </ng-template>
  `,
})
export class DatePickerTypeComponent extends FieldType {
  public clear() {
    this.field.parent.formControl.get(String(this.field.key)).setValue(null);
  }
}
