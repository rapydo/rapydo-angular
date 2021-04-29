import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";

import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { FormlyService } from "@rapydo/services/formly";
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "@rapydo/services/api";
import { NotificationService } from "@rapydo/services/notification";

import { Schema, Email } from "@rapydo/types";

@Component({
  templateUrl: "admin_mail.html",
})
export class AdminMailComponent implements OnInit {
  @ViewChild("show_email", { static: false })
  public show_email: TemplateRef<any>;
  public modalRef: NgbModalRef;

  public showForm: boolean = true;
  public form = new FormGroup({});
  public fields: FormlyFieldConfig[] = [];
  public model: any = {};

  // as Produced by dry run execution
  public email: Email;

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
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
      .post<Schema[]>("/api/admin/mail", { get_schema: true })
      .subscribe(
        (response) => {
          for (let idx in response) {
            if (response[idx]["key"] == "dry_run") {
              delete response[idx];
            }
          }
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

  public send(dry_run: boolean = true): boolean {
    if (!this.form.valid) {
      return false;
    }
    this.spinner.show();
    this.model["dry_run"] = dry_run;
    this.api
      .post<Email>("/api/admin/mail", this.model, { validationSchema: "Email" })
      .subscribe(
        (response) => {
          this.spinner.hide();

          if (!dry_run) {
            this.notify.showSuccess("Mail successfully sent");
            this.showForm = false;
          } else {
            this.email = response;
            this.modalRef = this.modalService.open(this.show_email, {
              size: "lg",
            });

            this.modalRef.result.then(
              (result) => {
                return this.send(false);
              },
              (reason) => {}
            );
          }
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
    return true;
  }
}
