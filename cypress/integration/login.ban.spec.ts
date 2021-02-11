// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword, get_totp } from "../../fixtures/utilities";

describe("Login Ban", () => {
  if (Cypress.env("AUTH_MAX_LOGIN_ATTEMPTS") > 0) {
    it("Ban after wrong password", () => {
      const email = "bbbb111111111" + Math.random() + "@sample.org";
      const pwd = getpassword(4);

      cy.createuser(email, pwd);

      // 10 is the default used by backend (services/authentication) in testing mode
      const max_failures = Math.max(Cypress.env("AUTH_MAX_LOGIN_ATTEMPTS"), 10);

      cy.visit("/app/login");
      cy.get("div.card-header h4").contains("Login");
      cy.get("input[placeholder='Your username (email)']").clear().type(email);
      for (let i = 0; i < max_failures; i++) {
        cy.get("input[placeholder='Your password']")
          .clear()
          .type(getpassword(4));
        cy.get("button").contains("Login").click();
        cy.checkalert("Invalid access credentials");
      }

      cy.get("input[placeholder='Your password']").clear().type(pwd);
      cy.get("button").contains("Login").click();
      cy.checkalert(
        "Sorry, this account is temporarily blocked due to the number of failed login attempts."
      );

      cy.visit("/public/reset");
      cy.get("input[id=formly_1_input_reset_email_0]").clear().type(email);
      cy.get("button:contains('Submit request')").click();
      cy.checkalert(
        "Sorry, this account is temporarily blocked due to the number of failed login attempts."
      );

      cy.login();
      cy.deleteuser(email);
    });

    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      it("Ban after wrong totp", () => {
        const email = "bbbb222222222" + Math.random() + "@sample.org";
        const pwd = getpassword(4);

        cy.createuser(email, pwd);
        // 10 is the default used by backend (services/authentication) in testing mode
        const max_failures = Math.max(
          Cypress.env("AUTH_MAX_LOGIN_ATTEMPTS"),
          10
        );

        cy.visit("/app/login");
        cy.get("div.card-header h4").contains("Login");
        cy.get("input[placeholder='Your username (email)']")
          .clear()
          .type(email);
        cy.get("input[placeholder='Your password']").clear().type(pwd);
        cy.get("button").contains("Login").click();

        cy.get("input[placeholder='Your password']").should("not.exist");
        cy.get("div.card-header h4").contains("Provide the verification code");

        for (let i = 0; i < max_failures; i++) {
          cy.get("input[placeholder='TOTP verification code']")
            .clear()
            .type("000000");
          cy.get("button").contains("Authorize").click();
          cy.checkalert("Verification code is not valid");
        }

        cy.get("input[placeholder='TOTP verification code']")
          .clear()
          .type(get_totp());
        cy.get("button").contains("Authorize").click();
        cy.checkalert(
          "Sorry, this account is temporarily blocked due to the number of failed login attempts."
        );

        cy.visit("/public/reset");
        cy.get("input[id=formly_1_input_reset_email_0]").clear().type(email);
        cy.get("button:contains('Submit request')").click();
        cy.checkalert(
          "Sorry, this account is temporarily blocked due to the number of failed login attempts."
        );

        cy.login();
        cy.deleteuser(email);
      });
    }
  }
});
