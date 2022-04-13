import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FieldWrapper } from "@ngx-formly/core";

// Warning: this template is not properly working
// The problem is that by using ng-template #fieldComponent, the input element is
// wrapped by an additional selector that breaks bs5 floating labels:
// <formly-field-input class="ng-star-inserted">
// <input ... />
// </formly-field-input>
// <label for="..." class="col-form-label col-form-label-sm">
//   MyLabel
// </label>
@Component({
  selector: "form-field-floating",
  template: `
    <div class="form-floating mb-3">
      <ng-template #fieldComponent></ng-template>

      <label [attr.for]="id" class="col-form-label" *ngIf="to.label">
        {{ to.label }}
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFloatingWrapper extends FieldWrapper {}
