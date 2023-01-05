// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import {
  getpassword,
  get_random_username,
  get_totp,
} from "../fixtures/utilities";

describe("Login", () => {
  // do not directly create the random values here,
  // otherwise will be always the same on each test repetition!
  // do not generate it in the before() block, or will be not re-created on repetitions
  let email;
  let pwd;

  // it should be a before() ... but it is not random enough
  it("Setup", () => {
    email = get_random_username("testpwdexpiration");
    pwd = getpassword(4);
    cy.createuser(email, pwd);
  });

  it("Password expired", () => {
    cy.visit("/app/login");

    cy.get("input[placeholder='Your username (email)']").as("user");
    cy.get("input[placeholder='Your password']").as("pwd");

    cy.intercept(
      // routeMatcher
      {
        path: "/auth/login",
        method: "POST",
        times: 1,
      },
      // staticResponse
      {
        statusCode: 403,
        body: {
          actions: ["PASSWORD EXPIRED"],
          errors: ["Your password is expired, please change it"],
        },
      }
    ).as("login");

    cy.get("@user").type(email);
    cy.get("@pwd").type(pwd, { parseSpecialCharSequences: false });
    cy.get("button").contains("Login").click();

    cy.wait("@login");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Your password is expired, please change it");
    cy.get("div.card-header h1").contains(
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

    cy.get("@new_pwd").clear().type(pwd, { parseSpecialCharSequences: false });
    cy.get("@pwd_confirm").clear().type("invalid");

    cy.checkvalidation(0, "The password does not match");
    cy.get("button").contains("Change").click();

    cy.get("@pwd_confirm")
      .clear()
      .type(pwd, { parseSpecialCharSequences: false });
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
  });

  after(() => {
    cy.login();
    cy.deleteuser(email);
  });
});
