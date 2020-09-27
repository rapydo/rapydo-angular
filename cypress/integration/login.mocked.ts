// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Mocked logins", () => {
  beforeEach(() => {
    cy.visit("/app/login");
    cy.closecookielaw();
  });

  it("Login - FIRST LOGIN", () => {
    cy.get("input[placeholder='Your password']").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD")
    );
    cy.get("input[placeholder='Your username (email)']").type(
      Cypress.env("AUTH_DEFAULT_USERNAME")
    );
    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  afterEach(() => {
    // restore default password and logout
  });
});
