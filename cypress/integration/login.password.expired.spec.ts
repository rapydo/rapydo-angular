// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword, get_totp } from "../../fixtures/utilities";

describe("Login", () => {
  const email = "aaaaaaaaaa000333@sample.org";
  let pwd = getpassword(4);

  before(() => {
    cy.createuser(email, pwd);
  });

  it("PASSWORD EXPIRED", () => {
    cy.visit("/app/login");

    cy.get("input[placeholder='Your username (email)']").as("user");
    cy.get("input[placeholder='Your password']").as("pwd");

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

    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.get("button").contains("Authorize").click();
    }
    cy.checkalert("The new password cannot match the previous password");

    const new_pwd1 = getpassword(1);
    cy.get("@new_pwd").clear().type(new_pwd1);
    cy.get("@pwd_confirm").clear().type(new_pwd1);
    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.get("button").contains("Authorize").click();
    } else {
      cy.get("button").contains("Change").click();
    }
    cy.checkalert("Password is too weak, missing upper case letters");

    cy.get("@new_pwd").clear().type(new_pwd1.toUpperCase());
    cy.get("@pwd_confirm").clear().type(new_pwd1.toUpperCase());
    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.get("button").contains("Authorize").click();
    } else {
      cy.get("button").contains("Change").click();
    }
    cy.checkalert("Password is too weak, missing lower case letters");

    const new_pwd2 = getpassword(2);
    cy.get("@new_pwd").clear().type(new_pwd2);
    cy.get("@pwd_confirm").clear().type(new_pwd2);
    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.get("button").contains("Authorize").click();
    } else {
      cy.get("button").contains("Change").click();
    }
    cy.checkalert("Password is too weak, missing numbers");

    const new_pwd3 = getpassword(3);
    cy.get("@new_pwd").clear().type(new_pwd3);
    cy.get("@pwd_confirm").clear().type(new_pwd3);
    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.get("button").contains("Authorize").click();
    } else {
      cy.get("button").contains("Change").click();
    }
    cy.checkalert("Password is too weak, missing special characters");

    const new_pwd4 = email + "AADwfef331!!";
    cy.get("@new_pwd").clear().type(new_pwd4);
    cy.get("@pwd_confirm").clear().type(new_pwd4);
    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.get("button").contains("Authorize").click();
    } else {
      cy.get("button").contains("Change").click();
    }

    cy.checkalert("Password is too weak, can't contain your email address");

    const new_pwd = getpassword(4);
    cy.get("@new_pwd").clear().type(new_pwd);
    cy.get("@pwd_confirm").clear().type(new_pwd);
    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.get("button").contains("Authorize").click();
    } else {
      cy.get("button").contains("Change").click();
    }

    cy.logout();
  });

  after(() => {
    cy.login();
    cy.deleteuser(email);
  });
});
