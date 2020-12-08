// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword } from "../../fixtures/utilities";

describe("Mocked logins", () => {
  it("Login - Missing or empty actions", () => {
    cy.visit("/app/login");
    cy.closecookielaw();

    cy.get("input[placeholder='Your username (email)']").as("user");
    cy.get("input[placeholder='Your password']").as("pwd");

    // Cypress is still not able to override intercept..
    // Cannot set two or more intercepts on the same endpoint :-(
    cy.server();
    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        errors: ["Please change your temporary password"],
      },
    });

    cy.get("@user").type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@pwd").type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Unrecognized response from server");
    cy.checkalert("Please change your temporary password");

    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        actions: [],
        errors: [],
      },
    });

    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Unrecognized response from server");

    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        errors: ["Extra error1", "Extra error2"],
      },
    });

    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Unrecognized response from server");
    cy.checkalert("Extra error1");
    cy.checkalert("Extra error2");
    cy.server({ enable: false });
  });

  it("Login - Unknown action", () => {
    cy.visit("/app/login");
    cy.closecookielaw();

    cy.get("input[placeholder='Your username (email)']").as("user");
    cy.get("input[placeholder='Your password']").as("pwd");

    cy.intercept("POST", "/auth/login", {
      statusCode: 403,
      body: {
        actions: ["invalid"],
        errors: ["invalid"],
      },
    }).as("post");

    cy.get("@user").type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@pwd").type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Login").click();

    cy.wait("@post");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Unrecognized response from server");
  });
});
