import { Component, Injectable } from "@angular/core";
import { FieldType } from "@ngx-formly/bootstrap/form-field";
import { NgbDateAdapter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class SimpleDateAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = "-";

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date
      ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day
      : null;
  }
}

@Component({
  selector: "formly-field-datepicker",
  template: `
    <ng-template #fieldTypeTemplate>
      <div class="input-group">
        <input
          readonly
          class="form-control datepicker input-addons"
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
  providers: [{ provide: NgbDateAdapter, useClass: SimpleDateAdapter }],
})
export class SimpleDatePickerTypeComponent extends FieldType {
  constructor(private dateAdapter: NgbDateAdapter<string>) {
    super();
  }

  public clear() {
    this.field.parent.formControl.get(String(this.field.key)).setValue(null);
  }
}
