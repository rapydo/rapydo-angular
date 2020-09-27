import "@cypress/code-coverage/support";
import "cypress-localstorage-commands";

// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: Cypress.env("API_URL") + "auth/login",
    body: {
      username: Cypress.env("AUTH_DEFAULT_USERNAME"),
      password: Cypress.env("AUTH_DEFAULT_PASSWORD"),
    },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status == 403) {
      cy.wrap(response.body)
        .its("actions")
        .should(($actions) => {
          // Is this chaijs syntax?
          expect($actions).to.be.an("array");
          expect($actions).to.have.lengthOf.above(0);
          expect($actions[0]).to.equal("FIRST LOGIN");

          // send new password
          cy.request({
            method: "POST",
            url: Cypress.env("API_URL") + "auth/login",
            body: {
              username: Cypress.env("AUTH_DEFAULT_USERNAME"),
              password: Cypress.env("AUTH_DEFAULT_PASSWORD"),
              new_password: Cypress.env("AUTH_DEFAULT_PASSWORD") + "!",
              password_confirm: Cypress.env("AUTH_DEFAULT_PASSWORD") + "!",
            },
          }).then((response) => {
            // First password changed, now:
            // 1 - restore default password
            cy.pwdchange(
              Cypress.env("AUTH_DEFAULT_USERNAME"),
              Cypress.env("AUTH_DEFAULT_PASSWORD") + "!",
              Cypress.env("AUTH_DEFAULT_PASSWORD")
            );

            // 2 - wait for the password change to complete (1 second should be enough)
            cy.wait(1000);

            // 3 - login again with the default password
            cy.login();
          });
        });
    } else if (response.status == 200) {
      cy.setLocalStorage("token", JSON.stringify(response.body));

      const options = {
        method: "GET",
        url: Cypress.env("API_URL") + "auth/profile",
        headers: {
          Authorization: `Bearer ${response.body}`,
        },
      };

      cy.request(options).then((response) => {
        cy.setLocalStorage("currentUser", JSON.stringify(response.body));
      });
    } else {
      throw new Error("Unexpected login response: " + response.status);
    }
  });
});
Cypress.Commands.add("pwdchange", (username, password, new_password) => {
  const password_confirm = new_password;
  //                                         This is ES6 Literal Shorthand Syntax
  cy.request("POST", Cypress.env("API_URL") + "auth/login", {
    username,
    password,
  })
    .its("body")
    .then((token) => {
      const options = {
        method: "PUT",
        url: Cypress.env("API_URL") + "auth/profile",
        headers: { Authorization: `Bearer ${token}` },
        body: { password, new_password, password_confirm },
      };
      cy.request(options).then((response) => {
        cy.log("Password changed");
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
Cypress.Commands.add("checkalert", (msg) => {
  cy.wait(200);
  cy.get("div[role=alertdialog]").contains(msg).click({ force: true });
});
Cypress.Commands.add("getmail", () => {
  return cy.readFile("/logs/mock.mail.lastsent.body");
});
