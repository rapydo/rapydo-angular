
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { NotificationService} from '../../services/notification';

@Component({
  selector: 'changepassword',
  providers: [ApiService, AuthService, NotificationService],
  templateUrl: './changepassword.html'
})
export class ChangePasswordComponent { 

  private form = new FormGroup({});
  private fields: FormlyFieldConfig[] = []; 
  private model:any = {}
  private user: any

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private notify: NotificationService,
    private router: Router

  ) {

    this.user = auth.getUser();

    if (this.user["2fa"] && this.user["2fa"] == "TOTP") {
      this.fields.push(
        {
          "key": 'totp_code',
          "type": 'input',
          "templateOptions": {
            "type": 'number',
            "label": 'Verification code',
            "addonLeft": {
              "class": "fa fa-shield"
            },
            "required": true,
            "min": 100000,
            "max": 999999

          }
        }
      );
    } else {
      this.fields.push(
        {
          "key": 'currentPwd',
          "type": 'input',
          "templateOptions": {
            "type": 'password',
            "label": 'Current password',
            "addonLeft": {
              "class": "fa fa-key"
            },
            "required": true
          }
        }
      );
    }

    this.fields.push(
      {
        "key": 'newPwd',
        "type": 'input',
        "templateOptions": {
          "type": 'password',
          "label": 'New password',
          "addonLeft": {
            "class": "fa fa-key"
          },
          "required": true,
          "minLength": 8
        }
      }
    );
    this.fields.push(
      {
        "key": 'confirmPwd',
        "type": 'input',
        "templateOptions": {
          "type": 'password',
          "label": 'Confirm password',
          "addonLeft": {
            "class": "fa fa-key"
          },
          "required": true
        },
        "validators": {
          "fieldMatch": {
            "expression": (control) => control.value === this.model.newPwd,
            "message": "Password not matching"
          }
        }
      }
    );

  }

  submit() {

    if (!this.form.valid) {
        return false;
    }

    let data = {}
    data["new_password"] = this.model["newPwd"];
    data["password_confirm"] = this.model["confirmPwd"];

    if (this.model["currentPwd"])	
      data["password"] = this.model["currentPwd"];

    if (this.model["totp_code"])	
      data["password"] = this.model["totp_code"];

    let username = this.auth.getUser().email;
    this.auth.change_password(data).subscribe(
      response =>  {
        this.model["newPwd"] = ""
        this.model["confirmPwd"]= ""
        this.notify.showSuccess("Password successfully changed")

        this.auth.login(username, data["new_password"]).subscribe(
          data => {
            this.auth.loadUser().subscribe(
              response => {
                this.router.navigate(['']);
                this.notify.extractErrors(response, this.notify.WARNING);
              }, 
              error => {
                if (error.status == 0) {
                  this.router.navigate(["/offline"]);
                } else {
                  this.notify.extractErrors(error, this.notify.ERROR);
                }
              }
            );
          }, error => {
            this.notify.extractErrors(error, this.notify.ERROR);
          }
        );
      }, error => {

        if (error.status == 401) {
           this.notify.showError("Unauthorized request, current password is wrong?");
        } else {
          this.notify.extractErrors(error, this.notify.ERROR);
        }
      }
    );

  }
}
