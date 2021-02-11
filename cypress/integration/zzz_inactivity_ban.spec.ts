// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { get_totp } from "../../fixtures/utilities";

if (Cypress.env("AUTH_DISABLE_UNUSED_CREDENTIALS_AFTER")) {
  describe("Test inactivity ban", () => {
    it("Login to verify the account is banned for inactivity", () => {
      // Account created in aaa_init_default_user
      const email = "iwillremaininactive@sample.org";
      // A random password can be used because the inactivity check is executed before the password verification
      const pwd = getpassword(4);

      // default username/password and via_form = true
      cy.visit("/app/login");
      cy.get("div.card-header h4").contains("Login");
      cy.closecookielaw();

      cy.get("input[placeholder='Your username (email)']").clear().type(email);
      cy.get("input[placeholder='Your password']").clear().type(pwd);
      cy.get("button").contains("Login").click();

      cy.checkalert("Sorry, this account is blocked for inactivity");
    });
  });
}
