// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("404", () => {
  it("Invalid page", () => {
    cy.wait(60000);

    cy.visit("/app/login");

    cy.visit("app/invalid");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/404");
    });

    cy.get("div.card-header h1").contains("404 - Page not found");
    cy.get("div.card-body h2").contains(
      "The page you requested could not be found!"
    );
    cy.get("div.card-body h4").contains(
      "Please report the error if you reached this page by following a link"
    );

    cy.contains("GO HOME");
    cy.contains("GO BACK").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });
});
