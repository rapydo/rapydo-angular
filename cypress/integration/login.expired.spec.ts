// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword } from "../../fixtures/utilities";

describe("AccountExpired", () => {
  it("LOGIN EXPIRED", () => {
    const email = "aaaaaaaaaa000444" + Math.random() + "@sample.org";
    const pwd = getpassword(4);

    cy.login();
    cy.createuser(email, pwd, true);
    cy.logout();

    cy.visit("/app/login");
    cy.closecookielaw();

    cy.get("input[placeholder='Your username (email)']").as("user");
    cy.get("input[placeholder='Your password']").as("pwd");

    cy.get("@user").type(email);
    cy.get("@pwd").type(pwd);
    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Sorry, this account is expired");

    cy.visit("/public/reset");
    cy.get("div.card-header h4").contains("Reset your password");

    cy.intercept("POST", "/auth/reset").as("reset");

    cy.get(
      'input[placeholder="Type here your email address to receive the reset link"]'
    )
      .clear()
      .type(email);
    cy.get("button:contains('Submit request')").click();

    cy.wait("@reset");

    cy.checkalert("Sorry, this account is expired");

    cy.login();
    cy.deleteuser(email);
  });
});
