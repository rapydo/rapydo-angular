import { Component } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from "@angular/forms";

import { AuthService } from "@rapydo/services/auth";
import { User } from "@rapydo/types";
import { ApiService } from "@rapydo/services/api";
import { NotificationService } from "@rapydo/services/notification";
import { FormlyService } from "@rapydo/services/formly";
import { Schema } from "@rapydo/types";
import { FormModal } from "@rapydo/components/forms/form_modal";

@Component({
  templateUrl: "profile.html",
})
export class ProfileComponent {
  public user: User;

  protected modalRef: NgbModalRef;
  public form;
  public fields;
  public model;

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private notify: NotificationService,
    private api: ApiService,
    private auth: AuthService,
    private formly: FormlyService
  ) {
    this.reloadUser();
  }

  private reloadUser() {
    this.spinner.show();
    this.auth.loadUser().subscribe(
      (response) => {
        this.user = response;
        this.spinner.hide();
      },
      (error) => {
        this.notify.showError(error);
        this.spinner.hide();
      }
    );
  }
  public edit_profile(): void {
    this.api
      .patch<Schema[]>("/auth/profile", { get_schema: true })
      .subscribe(
        (response) => {
          response.some((value, index) => {
            if (value.key === "privacy_accepted") {
              response.splice(index, 1);
              return true;
            }
          });

          let model = {};
          for (let field of response) {
            model[field.key] = this.user[field.key];
          }

          let data = this.formly.json2Form(response, model);

          this.form = new FormGroup({});
          this.fields = data.fields;
          this.model = data.model;
          this.modalRef = this.modalService.open(FormModal, {
            size: "m",
            backdrop: "static",
          });
          this.modalRef.componentInstance.modalTitle = "Update your profile";
          this.modalRef.componentInstance.updating = false;
          this.modalRef.componentInstance.form = this.form;
          this.modalRef.componentInstance.fields = this.fields;
          this.modalRef.componentInstance.model = this.model;
          this.modalRef.componentInstance.backRef = this;
          this.modalRef.result.then(
            (result) => {},
            (reason) => {}
          );
        },
        (error) => {
          this.notify.showError(error);
        }
      );
  }

  public submit(): void {
    if (this.form.valid) {
      this.spinner.show();
      this.api.patch("/auth/profile", this.model).subscribe(
        (response) => {
          this.modalRef.close("");
          this.notify.showSuccess("Confirmation: Profile successfully updated");
          // spinner hide is included into the reload user method
          this.reloadUser();
        },
        (error) => {
          this.notify.showError(error);
          this.spinner.hide();
        }
      );
    }
  }
}
