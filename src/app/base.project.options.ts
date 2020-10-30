export abstract class BaseProjectOptions {
  abstract privacy_statements(): any;

  // It is used in admin users page to add custom columns
  abstract custom_user_data(): any[];

  abstract registration_disclaimer(): string;

  // return null to enable default text
  abstract cookie_law_text(): string;

  // return null to enable default text
  abstract cookie_law_button(): string;
}
