// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword } from "../../fixtures/utilities";

if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === 1) {
  const email = "aaaaaaaaaa000112@sample.org";
  const pwd = getpassword(4);

  describe("ChangeTemporaryPassword", () => {
    beforeEach(() => {
      cy.login();

      cy.createuser(email, pwd);

      cy.logout();
    });

    it("ChangeTemporaryPassword", () => {
      cy.closecookielaw();

      cy.get("input[placeholder='Your username (email)']").clear().type(email);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(pwd + "{enter}");

      cy.get("div.card-header")
        .should("have.class", "bg-warning")
        .find("h4")
        .contains("Please change your temporary password");

      cy.checkalert("Please change your temporary password");

      cy.get('button:contains("Change")').as("change");
      cy.get('input[placeholder="Your new password"]').as("newpwd");
      cy.get('input[placeholder="Confirm your new password"]').as("confirm");

      cy.get("@change").click({ force: true });

      cy.checkvalidation(0, "This field is required");
      cy.checkvalidation(1, "This field is required");

      cy.get("@newpwd").clear().type("a");
      cy.checkvalidation(
        0,
        "Should have at least " +
          Cypress.env("AUTH_MIN_PASSWORD_LENGTH") +
          " characters"
      );

      let newPassword = getpassword(1);
      cy.get("@newpwd").clear().type(newPassword);
      cy.get("@confirm").clear().type(getpassword(4));
      cy.checkvalidation(0, "The password does not match");

      cy.get("@confirm").clear().type(newPassword);
      cy.get("@change").click({ force: true });
      cy.checkalert("Password is too weak, missing upper case letters");

      cy.get("@newpwd").clear().type(newPassword.toUpperCase());
      cy.get("@confirm").clear().type(newPassword.toUpperCase());
      cy.get("@change").click({ force: true });
      cy.checkalert("Password is too weak, missing lower case letters");

      cy.get("@newpwd").clear().type(pwd);
      cy.get("@confirm").clear().type(pwd);
      cy.get("@change").click({ force: true });
      cy.checkalert("The new password cannot match the previous password");

      newPassword = getpassword(2);
      cy.get("@newpwd").clear().type(newPassword);
      cy.get("@confirm").clear().type(newPassword);
      cy.get("@change").click({ force: true });
      cy.checkalert("Password is too weak, missing numbers");

      newPassword = getpassword(3);
      cy.get("@newpwd").clear().type(newPassword);
      cy.get("@confirm").clear().type(newPassword);
      cy.get("@change").click({ force: true });
      cy.checkalert("Password is too weak, missing special characters");

      cy.intercept("POST", "/auth/login").as("changed");

      cy.get("@newpwd")
        .clear()
        .type(pwd + "!");
      cy.get("@confirm")
        .clear()
        .type(pwd + "!");
      cy.get("@change").click({ force: true });

      cy.wait("@changed");

      cy.visit("/app/profile");
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/profile");
      });
      cy.get("table").find("td").contains(email);

      cy.logout();

      cy.login(email, pwd + "!");

      cy.visit("/app/profile");
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/profile");
      });
    });

    afterEach(() => {
      cy.logout();

      cy.login();
      cy.deleteuser(email);
    });
  });
}
