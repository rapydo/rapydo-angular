// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword, get_totp } from "../../fixtures/utilities";

describe("Init user", () => {
  it("Login via form to change first password / setup TOTP if needed", () => {
    // default username/password and via_form = true
    cy.visit("/app/login");
    cy.get("div.card-header h1").contains("Login");
    cy.closecookielaw();

    cy.login_and_init_user();

    // Change back to the default password
    if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === 1) {
      // without this wait, sometimes, the getUser in changepassword.ts
      // does not return a value and the TOTP field is not filled up
      cy.wait(1000);
      cy.visit("/app/profile/changepassword");

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/profile/changepassword");
      });

      cy.get("div.card-header h1").contains("Change your password");

      const pwd = Cypress.env("AUTH_DEFAULT_PASSWORD");

      cy.get('input[placeholder="Type here your current password"]')
        .clear()
        .type(pwd + "!");
      cy.get('input[placeholder="Type the desidered new password"]')
        .clear()
        .type(pwd);
      cy.get(
        'input[placeholder="Type again the new password for confirmation"]'
      )
        .clear()
        .type(pwd);

      if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
        cy.get('input[placeholder="TOTP verification code"]')
          .clear()
          .type(get_totp());
      }

      cy.get("button:contains('Submit')").click();
    }

    if (Cypress.env("AUTH_DISABLE_UNUSED_CREDENTIALS_AFTER")) {
      // Create a user to test inactivity ban

      const email = "iwillremaininactive@sample.org";
      const pwd = "Just1Password!";

      cy.createuser(email, pwd);
    }
  });
});
