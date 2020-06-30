// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Profile", () => {
  it("Profile - without authentication", () => {
    cy.visit("/app/profile");

    // Profile page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("Profile - with authentication", () => {
    cy.login();

    cy.visit("/app/profile");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.get("table").find("th").contains("Name");
    cy.get("table").find("th").contains("Email");
    cy.get("table").find("th").contains("Roles");
    cy.get("table").find("th").contains("Privacy Accepted");
    cy.get("table").find("th").contains("Password");
    cy.get("table").find("th").contains("Open Sessions");

    cy.get("table").find("td").contains(Cypress.env("AUTH_DEFAULT_USERNAME"));

    // test... something
  });
});
