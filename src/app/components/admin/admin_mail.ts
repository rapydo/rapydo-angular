import { Component, OnInit } from "@angular/core";

import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";

import { FormlyService } from "@rapydo/services/formly";
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "@rapydo/services/api";
import { NotificationService } from "@rapydo/services/notification";

import { Schema } from "@rapydo/types";

@Component({
  templateUrl: "admin_mail.html",
})
export class AdminMailComponent implements OnInit {
  public showForm: boolean = true;
  public form = new FormGroup({});
  public fields: FormlyFieldConfig[] = [];
  public model: any = {};

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private notify: NotificationService,
    private formly: FormlyService
  ) {}

  ngOnInit() {
    this.open_form();
  }

  public open_form(): void {
    this.spinner.show();
    this.api
      .post<Schema[]>("admin/mail", { get_schema: true })
      .subscribe(
        (response) => {
          let data = this.formly.json2Form(response, {});
          this.fields = data.fields;

          // list of emails are not supported... let's convert them by hand
          for (let idx in this.fields) {
            if (this.fields[idx]["type"] === "") {
              const field_key = this.fields[idx]["key"];
              if (field_key === "cc" || field_key === "bcc") {
                this.fields[idx]["type"] = "input";
              }
            }
          }

          this.showForm = true;
          this.spinner.hide();
        },
        (error) => {
          this.notify.showError(error);
          this.spinner.hide();
        }
      );
  }
  public send(): void {
    if (this.form.valid) {
      this.spinner.show();
      this.api.post("admin/mail", this.model).subscribe(
        (response) => {
          this.spinner.hide();
          this.notify.showSuccess("Mail successfully sent");
          this.showForm = false;
        },
        (error) => {
          if (typeof error === "object" && ("cc" in error || "bcc" in error)) {
            if ("cc" in error) {
              this.notify.showError(error["cc"], "CC field validation error");
            }

            if ("bcc" in error) {
              this.notify.showError(error["bcc"], "BCC field validation error");
            }
          } else {
            this.notify.showError(error);
          }
          this.spinner.hide();
        }
      );
    }
  }
}
