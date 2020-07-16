// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("KitchenSink", () => {
  cy.login();

  cy.visit("/app/sink");

  cy.location().should((location) => {
    if (location.pathname.to.eq("/app/sink")) {
      cy.contains("Lorem ipsum dolor sit amet, consectetur adipiscing elit");
    }
  });
});
