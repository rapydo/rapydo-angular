// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Prod Test", () => {
  it("Visits webpage", () => {
    cy.visit("https://localhost");
    cy.get("navbar");
  });
});
