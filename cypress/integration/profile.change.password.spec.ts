// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import {
  getpassword,
  get_random_username,
  get_totp,
} from "../../fixtures/utilities";

describe("ChangePassword", () => {
  // do not directly create the random values here,
  // otherwise will be always the same on each test repetition!
  // do not generate it in the before() block, or will be not re-created on repetitions
  let email;
  let pwd;

  let created = false;

  beforeEach(() => {
    if (!created) {
      email = get_random_username("testchangepassword");
      pwd = getpassword(4);
      cy.createuser(email, pwd);
      created = true;
    }

    cy.login(email, pwd);

    cy.visit("/app/profile/changepassword");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });
  });

  it("ChangePasswordFailures", () => {
    // Go back
    cy.get("button:contains('Cancel')").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.get("a:contains('CHANGE')").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });

    cy.get("div.card-header h1").contains("Change your password");

    cy.get("button:contains('Submit')").click();
    cy.checkvalidation(0, "This field is required");

    cy.get('input[placeholder="Type the desidered new password"]').as(
      "new_password"
    );
    cy.get(
      'input[placeholder="Type again the new password for confirmation"]'
    ).as("confirm_password");

    cy.get("@new_password").clear().type("short");
    cy.get("@confirm_password").clear().type("short");

    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get('input[placeholder="TOTP verification code"]')
        .clear()
        .type("111111");
    }

    // Set a wrong password for the current password
    cy.get('input[placeholder="Type here your current password"]')
      .clear()
      .type(getpassword(4), { parseSpecialCharSequences: false });

    cy.checkvalidation(
      0,
      "Should have at least " +
        Cypress.env("AUTH_MIN_PASSWORD_LENGTH") +
        " characters"
    );

    let newPassword = getpassword(1);
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(getpassword(1));
    cy.checkvalidation(0, "The password does not match");
    cy.get("@confirm_password").clear().type(newPassword);

    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get('input[placeholder="TOTP verification code"]')
        .clear()
        .type(get_totp());
    }

    cy.get("button:contains('Submit')").click();

    cy.checkalert("Invalid access credentials");
    cy.get('input[placeholder="Type here your current password"]')
      .clear()
      .type(pwd, { parseSpecialCharSequences: false });

    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing upper case letters");

    cy.get("@new_password").clear().type(newPassword.toUpperCase());
    cy.get("@confirm_password").clear().type(newPassword.toUpperCase());
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing lower case letters");

    newPassword = getpassword(2);
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(newPassword);
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing numbers");

    newPassword = getpassword(3);
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(newPassword);
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, missing special characters");

    newPassword = email + "AADwfef331!!";
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(newPassword);
    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password is too weak, can't contain your email address");

    cy.get("@new_password").clear().type(pwd, { parseSpecialCharSequences: false });
    cy.get("@confirm_password").clear().type(pwd, { parseSpecialCharSequences: false });
    cy.get("button:contains('Submit')").click();
    cy.checkalert("The new password cannot match the previous password");
  });

  it("ChangePassword", () => {
    cy.get("div.card-header h1").contains("Change your password");

    const newPassword = getpassword(4);

    cy.get('input[placeholder="Type here your current password"]')
      .clear()
      .type(pwd, { parseSpecialCharSequences: false });
    cy.get('input[placeholder="Type the desidered new password"]')
      .clear()
      .type(newPassword);
    cy.get('input[placeholder="Type again the new password for confirmation"]')
      .clear()
      .type(newPassword);

    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get('input[placeholder="TOTP verification code"]')
        .clear()
        .type(get_totp());
    }

    cy.intercept("PUT", "/auth/profile").as("changed");

    cy.get("button:contains('Submit')").click();

    cy.wait("@changed");

    cy.checkalert("Password successfully changed");

    // if TOTP is enabled the automatic re-login is not possible
    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("div.card-header h1").contains("Login");

      cy.get("input[placeholder='Your username (email)']").type(email);
      cy.get("input[placeholder='Your password']").type(newPassword);

      cy.intercept("POST", "/auth/login").as("login");
      cy.get("button").contains("Login").click();
      cy.wait("@login");

      cy.get("input[placeholder='Your password']").should("not.exist");

      cy.get("div.card-header h1").contains("Provide the verification code");
      cy.get("input[placeholder='TOTP verification code']").type(get_totp());

      cy.get("button").contains("Authorize").click();
      cy.get("input[placeholder='TOTP verification code']").should("not.exist");
    }

    cy.goto_profile();

    cy.get("table").find("td").contains(email);
  });

  after(() => {
    cy.logout();

    cy.login();
    cy.deleteuser(email);
  });
});
