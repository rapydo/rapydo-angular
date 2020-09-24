import { FormlyFieldConfig } from "@ngx-formly/core";
import { environment } from "@rapydo/../environments/environment";

export abstract class BaseProjectOptions {
  public allowPasswordReset: boolean =
    environment.allowPasswordReset === "true";
  public allowRegistration: boolean = environment.allowRegistration === "true";
  public allowTermsOfUse: boolean = environment.allowTermsOfUse === "true";
  public enableFooter: boolean = environment.enableFooter === "true";

  abstract privacy_statements(): any;

  // It is used in admin users page to enable group column
  abstract show_groups(): boolean;
  // It is used in admin users page to add custom columns
  abstract custom_user_data(): any[];

  abstract custom_registration_options(): FormlyFieldConfig[];
  abstract registration_disclaimer(): string;

  // return null to enable default text
  abstract cookie_law_text(): string;

  // return null to enable default text
  abstract cookie_law_button(): string;
}
