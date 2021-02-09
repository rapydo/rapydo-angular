// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword, get_totp } from "../../fixtures/utilities";

describe("Login Ban", () => {
  if (Cypress.env("AUTH_MAX_LOGIN_ATTEMPTS") > 0) {
    it("Ban after wrong password", () => {
      for (let i = 0; i < Cypress.env("AUTH_MAX_LOGIN_ATTEMPTS"); i++) {
        cy.visit("/app/login");
      }

      for (let i = 0; i < 2; i++) {
        cy.visit("/app/bah");
      }
    });

    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      it("Ban after wrong totp", () => {});
    }
  }
});
