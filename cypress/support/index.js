import "@cypress/code-coverage/support";
import "cypress-localstorage-commands";

// This is to silence ESLint about undefined cy
/*global Cypress*/

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
