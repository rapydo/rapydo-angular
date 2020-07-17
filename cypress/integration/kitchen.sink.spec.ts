// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("KitchenSink", () => {
  it("TestSink", () => {
    cy.login();

    cy.visit("/app/sink");

    cy.location("pathname").then((pathname) => {
      if (pathname == "/app/sink") {
        // Kitchen Sink is enabled, add here all tests!
        cy.contains("Lorem ipsum dolor sit amet, consectetur adipiscing elit");
      }
    });
  });
});
