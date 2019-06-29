import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatePickerComponent extends FieldType {}
