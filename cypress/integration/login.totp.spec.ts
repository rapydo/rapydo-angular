// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword } from "../../fixtures/utilities";

describe("Login", () => {
  it("TOTP", () => {
    cy.visit("/app/login");
    cy.closecookielaw();

    cy.get("input[placeholder='Your username (email)']").as("user");
    cy.get("input[placeholder='Your password']").as("pwd");

    cy.intercept("POST", "/auth/login", {
      statusCode: 403,
      body: {
        actions: ["TOTP"],
        errors: ["You do not provided a valid second factor"],
      },
    }).as("post");

    cy.get("@user").type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@pwd").type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Login").click();

    cy.wait("@post");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("You do not provided a valid second factor");
    cy.get("div.card-header h4").contains("Provide the verification cod");
    cy.get("button").contains("Authorize").click();

    // fill the form! Not yet implemented
  });
});
