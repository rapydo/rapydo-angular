import { Component } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

@Component({
  selector: "formly-field-datepicker",
  templateUrl: "datepicker.component.html",
})
export class DatePickerComponent extends FieldType {
  public clear() {
    this.field.parent.formControl.get(String(this.field.key)).setValue(null);
  }
}
