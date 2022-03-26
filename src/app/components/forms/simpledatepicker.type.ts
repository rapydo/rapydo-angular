import { Component, Injectable } from "@angular/core";
import { FieldType } from "@ngx-formly/core";
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
    <!--<pre>Model: {{field.parent.formControl.get(field?.key).value | json}}</pre>-->
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
