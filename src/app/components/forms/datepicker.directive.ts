import { Directive } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: 'input[type=bootstrap-date]',
  host: {
    '(change)': 'onChange($event)',
    '(blur)': 'onTouched()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DatePickerValueAccessor, multi: true },
  ],
})

export class DatePickerValueAccessor implements ControlValueAccessor {
  value: any;
  onChange = (_) => { console.log(_) };
  onTouched = () => { };

  writeValue(value) { }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
}