// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword, get_totp } from "../../fixtures/utilities";

describe("Login", () => {
  it("PASSWORD EXPIRED", () => {
    const email = "aaaaaaaaaa000333@sample.org";
    let pwd = getpassword(4);

    cy.login();
    cy.createuser(email, pwd);
    cy.logout();

    cy.visit("/app/login");
    cy.closecookielaw();

    cy.get("input[placeholder='Your username (email)']").as("user");
    cy.get("input[placeholder='Your password']").as("pwd");

    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      // A first login is needed because when TOTP is enabled a request cannot
      // start with a password expired error, but first password has to be changed

      cy.get("@user").type(email);
      cy.get("@pwd").type(pwd);
      cy.get("button").contains("Login").click();

      cy.get("div.card-header h4").contains(
        "Configure Two-Factor with Google Auth"
      );

      pwd += "!";
      const token = get_totp();
      cy.get("input[placeholder='Your new password']").type(pwd);
      cy.get("input[placeholder='Confirm your new password']").type(pwd);
      cy.get("input[placeholder='Generated TOTP']").type(token);
      cy.get("button").contains("Change").click();

      // This will also force the logout to prepare the page for the next check
      cy.visit("/app/login");
    }

    // Cypress is still not able to override intercept..
    // A single intercept is needed, that the test should continue will normal responses
    cy.server();
    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        actions: ["PASSWORD EXPIRED"],
        errors: ["Your password is expired, please change it"],
      },
    });

    cy.get("@user").type(email);
    cy.get("@pwd").type(pwd);
    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.server({ enable: false });

    cy.checkalert("Your password is expired, please change it");
    cy.get("div.card-header h4").contains(
      "Your password is expired, please change it"
    );
    cy.get("button").contains("Change").click();

    cy.checkvalidation(0, "This field is required");
    cy.checkvalidation(1, "This field is required");

    cy.get("input[placeholder='Your new password']").as("new_pwd");
    cy.get("input[placeholder='Confirm your new password']").as("pwd_confirm");

    cy.get("@new_pwd").clear().type("short");
    cy.checkvalidation(
      0,
      "Should have at least " +
        Cypress.env("AUTH_MIN_PASSWORD_LENGTH") +
        " characters"
    );
    cy.get("button").contains("Change").click();

    cy.get("@new_pwd").clear().type(pwd);
    cy.get("@pwd_confirm").clear().type("invalid");

    cy.checkvalidation(0, "The password does not match");
    cy.get("button").contains("Change").click();

    cy.get("@pwd_confirm").clear().type(pwd);
    cy.get("button").contains("Change").click();
    cy.checkalert("The new password cannot match the previous password");

    const new_pwd1 = getpassword(1);
    cy.get("@new_pwd").clear().type(new_pwd1);
    cy.get("@pwd_confirm").clear().type(new_pwd1);
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing upper case letters");

    cy.get("@new_pwd").clear().type(new_pwd1.toUpperCase());
    cy.get("@pwd_confirm").clear().type(new_pwd1.toUpperCase());
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing lower case letters");

    const new_pwd2 = getpassword(2);
    cy.get("@new_pwd").clear().type(new_pwd2);
    cy.get("@pwd_confirm").clear().type(new_pwd2);
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing numbers");

    const new_pwd3 = getpassword(3);
    cy.get("@new_pwd").clear().type(new_pwd3);
    cy.get("@pwd_confirm").clear().type(new_pwd3);
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing special characters");

    const new_pwd = getpassword(4);
    cy.get("@new_pwd").clear().type(new_pwd);
    cy.get("@pwd_confirm").clear().type(new_pwd);
    cy.get("button").contains("Change").click();

    if (Cypress.env("ALLOW_TERMS_OF_USE")) {
      cy.get("div.modal-footer h4").contains(
        "Do you accept all our Terms of Use?"
      );
      cy.get("div.modal-footer button").first().contains("YES").click();
    }

    cy.logout();

    cy.login();
    cy.deleteuser(email);
  });
});
