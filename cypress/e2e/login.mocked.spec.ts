// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword } from "../fixtures/utilities";

describe("Mocked login", () => {
  beforeEach(() => {
    cy.visit("/app/login");
    cy.closecookielaw();

    cy.get("input[placeholder='Your username (email)']").type(
      Cypress.env("AUTH_DEFAULT_USERNAME")
    );
    cy.get("input[placeholder='Your password']").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD")
    );
  });

  it("Missing actions, single error", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 403,
      body: {
        errors: ["Please change your temporary password"],
      },
    }).as("post");

    cy.get("button").contains("Login").click();

    cy.wait("@post");

    cy.checkalert("Unrecognized response from server");
    cy.checkalert("Please change your temporary password");
  });

  it("Missing actions, multiple errors", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 403,
      body: {
        errors: ["Extra error1", "Extra error2"],
      },
    }).as("post");

    cy.get("button").contains("Login").click();

    cy.wait("@post");

    cy.checkalert("Unrecognized response from server");
    cy.checkalert("Extra error1");
    cy.checkalert("Extra error2");
  });

  it("Empty actions", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 403,
      body: {
        actions: [],
        errors: [],
      },
    }).as("post");

    cy.get("button").contains("Login").click();

    cy.wait("@post");

    cy.checkalert("Unrecognized response from server");
  });

  it("Unknown action", () => {
    cy.intercept("POST", "/auth/login", {
      statusCode: 403,
      body: {
        actions: ["invalid"],
        errors: ["invalid"],
      },
    }).as("post");

    cy.get("button").contains("Login").click();

    cy.wait("@post");

    cy.checkalert("Unrecognized response from server");
  });

  afterEach(() => {
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });
});
