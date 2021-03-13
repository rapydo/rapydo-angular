import {
  NgModule,
  ModuleWithProviders,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, AbstractControl } from "@angular/forms";
import { ReactiveFormsModule, ValidationErrors } from "@angular/forms";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { UploadxModule } from "ngx-uploadx";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  NgbDateAdapter,
  NgbDateNativeUTCAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";

import { MomentModule } from "ngx-moment";
import * as moment from "moment";

import { ClipboardModule } from "ngx-clipboard";

import { FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyFieldConfig } from "@ngx-formly/core/lib/components/formly.field.config";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgOptionHighlightModule } from "@ng-select/ng-option-highlight";

import { FormlyHorizontalWrapper } from "@rapydo/components/forms/bootstrap.horizontal.wrapper";
import { FormlyDescriptiveRadio } from "@rapydo/components/forms/radio-type.component";
import { TermsOfUseCheckbox } from "@rapydo/components/forms/terms_of_use_checkbox";
import { DatePickerTypeComponent } from "@rapydo/components/forms/datepicker.type";
import { PasswordComponent } from "@rapydo/components/forms/password.component";
import { NgSelectFormlyComponent } from "@rapydo/components/forms/ng-select.type";

import { NgxSpinnerModule } from "ngx-spinner";

import { IteratePipe } from "@rapydo/pipes/iterate";
import { BytesPipe } from "@rapydo/pipes/bytes";
import { BooleanFlagPipe } from "@rapydo/pipes/boolean_flag";
import { YesNoPipe } from "@rapydo/pipes/yes_or_no";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";
import { DeleteModal } from "@rapydo/components/delete_modal";
import { FormModal } from "@rapydo/components/forms/form_modal";

export function emailValidator(
  control: AbstractControl,
  fieldConfig: FormlyFieldConfig
): ValidationErrors {
  /*
    - first chr of name is a letter
    - other chr allowed in name after the first: letters, number, . _ -
    - required @
    - first chr of domain is a letter or number (@163.com)
    - other chr allowed in domain after the first: letters, number, _ -
    - required a .
    - domain block can be repeated (letter/number)+(letters/numbers/-_).
    - required from 2 to 5 letters after the last . 
  */
  return /^[a-zA-Z]+[a-zA-Z0-9._-]*@[a-zA-Z0-9]+[a-zA-Z0-9_-]*\.([a-zA-Z0-9]+[a-zA-Z0-9_-]*\.)*[a-zA-Z]{2,5}$/.test(
    control.value
  )
    ? null
    : { email: true };
}

export function TOTPValidator(
  control: AbstractControl,
  fieldConfig: FormlyFieldConfig
): ValidationErrors {
  return /^[0-9]{6}$/.test(control.value) ? null : { totp: true };
}
export function URLValidator(
  control: AbstractControl,
  fieldConfig: FormlyFieldConfig
): ValidationErrors {
  if (control.value === null) {
    return null;
  }

  return /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    control.value
  )
    ? null
    : { url: true };

  /*
    Regular expression obtained from https://stackoverflow.com/questions/8667070/javascript-regular-expression-to-validate-url

    Just added a '?' after protocols to make schema optional (i.e. www.google.com is valid)

    How it works
      // protocol identifier
      "(?:(?:(?:https?|ftp):)?//)"
      // user:pass authentication
      "(?:\\S+(?::\\S*)?@)?"
      "(?:"
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})"
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})"
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})"
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])"
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}"
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))"
      "|"
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)"
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*"
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))"
      // port number
      "(?::\\d{2,5})?"
      // resource path
      "(?:[/?#]\\S*)?"
    */
}

export function minLengthValidationError(error, field) {
  return `Should have at least ${field.templateOptions.minLength} characters`;
}

// Can't be tested because inputs are prevented to add more characters then the maximum allowed
/* istanbul ignore next */
export function maxLengthValidationError(error, field) {
  return `Should have no more than ${field.templateOptions.maxLength} characters`;
}

export function minValidationError(error, field) {
  return `Should be greater than ${field.templateOptions.min}`;
}

export function maxValidationError(error, field) {
  return `Should be lower than ${field.templateOptions.max}`;
}

// ngbDatepicker uses { year: 'yyyy', month: 'mm', day: 'dd'} as date format by default
// this adapter allow ngbDatepicker to accept js native Dates
@Injectable()
export class MomentDateFormatter extends NgbDateParserFormatter {
  // Convert a string formatted as 'DD/MM/YYYY' into {year: 'yyyy', month: 'mm', day:}
  parse(value: string): NgbDateStruct {
    if (value) {
      value = value.trim();
      let mdt = moment(value, "DD/MM/YYYY");
      return {
        year: mdt.year(),
        month: 1 + mdt.month(),
        day: mdt.date(),
      };
    }
    return null;
  }

  // Convert {year: 'yyyy', month: 'mm', day:} 'dd' into DD/MM/YYYY
  format(date: NgbDateStruct): string {
    if (!date) {
      return "";
    }
    let mdt = moment([date.year, date.month - 1, date.day]);
    if (!mdt.isValid()) {
      return "";
    }
    return mdt.format("DD/MM/YYYY");
  }
}

let module_imports: any = [
  CommonModule,

  NgbModule,
  MomentModule,
  FormsModule,
  ReactiveFormsModule,
  NgxDatatableModule,
  UploadxModule,
  ClipboardModule,
  NgxSpinnerModule,
  FormlyBootstrapModule,
  NgSelectModule,
  NgOptionHighlightModule,
  FormlyModule.forRoot({
    wrappers: [
      { name: "form-field-horizontal", component: FormlyHorizontalWrapper },
    ],
    types: [
      {
        name: "radio",
        component: FormlyDescriptiveRadio,
        wrappers: ["form-field"],
      },
      { name: "terms_of_use", component: TermsOfUseCheckbox },
      {
        name: "datepicker",
        component: DatePickerTypeComponent,
        wrappers: ["form-field"],
      },
      {
        // extend password field with visibility toggle
        name: "password",
        component: PasswordComponent,
        wrappers: ["form-field"],
      },
      {
        name: "autocomplete",
        component: NgSelectFormlyComponent,
        wrappers: ["form-field"],
      },
    ],
    validationMessages: [
      { name: "required", message: "This field is required" },
      { name: "minlength", message: minLengthValidationError },
      { name: "maxlength", message: maxLengthValidationError },
      { name: "min", message: minValidationError },
      { name: "max", message: maxValidationError },
      { name: "email", message: "Invalid email address" },
      {
        name: "totp",
        message: "Invalid verification code (expected 6 digits)",
      },
      { name: "url", message: "Invalid web address" },
      { name: "ngbDate", message: "Invalid date, expected format: dd/mm/yyyy" },
    ],
    validators: [
      { name: "email", validation: emailValidator },
      { name: "totp", validation: TOTPValidator },
      { name: "url", validation: URLValidator },
    ],
  }),
];

let module_declarations = [
  IteratePipe,
  BytesPipe,
  BooleanFlagPipe,
  YesNoPipe,
  BasePaginationComponent,
  DeleteModal,
  FormModal,
  FormlyHorizontalWrapper,
  FormlyDescriptiveRadio,
  TermsOfUseCheckbox,
  DatePickerComponent,
  PasswordComponent,
  NgSelectFormlyComponent,
];

let module_exports = [
  CommonModule,

  FormlyHorizontalWrapper,
  FormlyDescriptiveRadio,
  TermsOfUseCheckbox,
  DatePickerComponent,
  PasswordComponent,

  NgxDatatableModule,
  NgbModule,
  MomentModule,
  FormsModule,
  ReactiveFormsModule,
  FormlyBootstrapModule,
  FormlyModule,
  UploadxModule,
  ClipboardModule,
  NgxSpinnerModule,

  IteratePipe,
  BytesPipe,
  BooleanFlagPipe,
  YesNoPipe,
  BasePaginationComponent,
  DeleteModal,
  FormModal,
];

let module_providers: any = [
  { provide: NgbDateAdapter, useClass: NgbDateNativeUTCAdapter },
  { provide: NgbDateParserFormatter, useValue: new MomentDateFormatter() },
];

@NgModule({
  imports: module_imports,
  declarations: module_declarations,
  exports: module_exports,
  providers: module_providers,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
