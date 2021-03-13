import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FieldType } from "@ngx-formly/core";

// Inspired from
// https://stackoverflow.com/questions/59105815/ngx-formly-password-visibility-toggle

@Component({
  selector: "formly-field-input",
  changeDetection: ChangeDetectionStrategy.OnPush,

  styles: [
    `
      input {
        // padding-left: 30px;
        padding-right: 30px;
      }
      .toggle {
        // float: left;
        float: right;
        // margin-left: 10px;
        margin-right: 10px;
        margin-top: -27px;
        position: relative;
        z-index: 2;
        color: gray;
      }
      .toggle-shift {
        margin-right: 30px;
      }
    `,
  ],
  // copied from https://github.com/ngx-formly/ngx-formly/blob/main/src/ui/bootstrap/input/src/input.type.ts
  template: `
    <input
      [type]="show ? 'text' : 'password'"
      [formControl]="formControl"
      class="form-control"
      [formlyAttributes]="field"
      [class.is-invalid]="showError"
    />

    <i
      class="clickable toggle fas "
      [ngClass]="{
        'fa-eye': show,
        'fa-eye-slash': !show,
        'toggle-shift': showError
      }"
      (mousedown)="show_password()"
      (mouseup)="hide_password()"
      (mouseleave)="hide_password()"
    ></i>
  `,
})
export class PasswordTypeComponent extends FieldType {
  public show: boolean = false;
  public show_password() {
    this.show = true;
  }
  public hide_password() {
    this.show = false;
  }
}
