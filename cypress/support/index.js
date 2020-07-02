import "@cypress/code-coverage/support";
import "cypress-localstorage-commands";

// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

Cypress.Commands.add("login", () => {
  cy.request("POST", Cypress.env("API_URL") + "auth/login", {
    username: Cypress.env("AUTH_DEFAULT_USERNAME"),
    password: Cypress.env("AUTH_DEFAULT_PASSWORD"),
  })
    .its("body")
    .then((response) => {
      cy.setLocalStorage("token", JSON.stringify(response));

      const options = {
        method: "GET",
        url: Cypress.env("API_URL") + "auth/profile",
        headers: {
          Authorization: `Bearer ${response}`,
        },
      };

      cy.request(options)
        .its("body")
        .then((response) => {
          cy.setLocalStorage("currentUser", JSON.stringify(response));
        });
    });
});

Cypress.Commands.add("closecookielaw", () => {
  cy.get("cookie-law").within((el) => {
    cy.root().should("have.attr", "seen", "false");

    cy.contains(
      "We uses cookies to ensure you get the best experience on our website"
    );
    // Close the cookie law banner
    cy.get('button:contains("Ok, got it")').click();
  });
});
