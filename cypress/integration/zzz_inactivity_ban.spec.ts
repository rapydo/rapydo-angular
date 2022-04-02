// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword, get_totp } from "../../fixtures/utilities";

if (Cypress.env("AUTH_DISABLE_UNUSED_CREDENTIALS_AFTER")) {
  describe("Test inactivity ban", () => {
    it("Login to verify the account is banned for inactivity", () => {
      // Account created in aaa_init_default_user
      const email = "iwillremaininactive@sample.org";
      const pwd = "Just1Password!";

      // default username/password and via_form = true
      cy.visit("/app/login");
      cy.get("div.card-header h1").contains("Login");
      cy.closecookielaw();

      cy.get("input[placeholder='Your username (email)']").clear().type(email);
      cy.get("input[placeholder='Your password']").clear().type(getpassword(4), { parseSpecialCharSequences: false });
      cy.get("button").contains("Login").click();
      cy.checkalert("Invalid access credentials");

      cy.get("input[placeholder='Your password']").clear().type(pwd, { parseSpecialCharSequences: false });
      cy.get("button").contains("Login").click();
      cy.checkalert("Sorry, this account is blocked for inactivity");
    });
  });
}
