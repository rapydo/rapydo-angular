// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("404", () => {
  it("Invalid page", () => {
    cy.visit("/app/login");

    cy.visit("app/invalid");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/404");
    });

    cy.get("div.card-header h2").contains("404 - Page not found");
    cy.get("div.card-body h5").contains(
      "The page you requested could not be found!"
    );
    cy.get("div.card-body h6").contains(
      "Please report the error if you reached this page by following a link"
    );

    cy.contains("go home");
    cy.contains("go back").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });
});
