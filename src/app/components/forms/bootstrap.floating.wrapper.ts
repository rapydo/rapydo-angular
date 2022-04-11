import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
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
      <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
        <formly-validation-message [field]="field"></formly-validation-message>
      </div>

      <label
        [attr.for]="id"
        class="col-form-label col-form-label-sm"
        *ngIf="to.label"
      >
        {{ to.label }}
        <ng-container *ngIf="to.required && to.hideRequiredMarker !== true"
          >*</ng-container
        >
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFloatingWrapper extends FieldWrapper {
  @ViewChild("fieldComponent", { read: ViewContainerRef, static: false })
  fieldComponent: ViewContainerRef;
}
