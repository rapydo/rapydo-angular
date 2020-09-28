// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Mocked logins", () => {
  beforeEach(() => {
    cy.visit("/app/login");
    cy.closecookielaw();

    cy.get("input[placeholder='Your password']").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD")
    );
    cy.get("input[placeholder='Your username (email)']").type(
      Cypress.env("AUTH_DEFAULT_USERNAME")
    );

    cy.server();
  });

  it("Login - Account not active", () => {
    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: "Sorry, this account is not active",
    });

    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.get("div.card-header h4").contains("This account is not active");
    cy.get("div.card-block").contains("Didn't receive an activation link?");
  });

  it("Login - Missing or empty actions", () => {
    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        errors: ["Please change your temporary password"],
      },
    });

    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Unrecognized response from server");

    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        actions: [],
        errors: [],
      },
    });

    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Unrecognized response from server");

    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        errors: ["Extra error1", "Extra error2"],
      },
    });

    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Unrecognized response from server");
    cy.checkalert("Extra error1");
    cy.checkalert("Extra error2");
  });

  it("Login - FIRST LOGIN", () => {
    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        actions: ["FIRST LOGIN"],
        errors: ["Please change your temporary password"],
      },
    });

    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.server({ enable: false });

    cy.checkalert("Please change your temporary password");
    cy.get("div.card-header h4").contains(
      "Please change your temporary password"
    );
    cy.get("button").contains("Change").click();

    cy.get("formly-validation-message")
      .eq(0)
      .contains("This field is required");
    cy.get("formly-validation-message")
      .eq(1)
      .contains("This field is required");

    cy.get("input[placeholder='Your new password']").as("new_pwd");
    cy.get("input[placeholder='Confirm your new password']").as("pwd_confirm");

    cy.get("@new_pwd").clear().type("short");
    cy.get("formly-validation-message")
      .eq(0)
      .contains("Should have at least 8 characters");
    cy.get("button").contains("Change").click();

    cy.get("@new_pwd").clear().type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("@pwd_confirm").clear().type("invalid");

    cy.get("formly-validation-message")
      .eq(0)
      .contains("The password does not match");
    cy.get("button").contains("Change").click();

    cy.get("@pwd_confirm").clear().type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Change").click();
    cy.checkalert("The new password cannot match the previous password");

    cy.get("@new_pwd").clear().type("loooooooong");
    cy.get("@pwd_confirm").clear().type("loooooooong");
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing upper case letters");

    cy.get("@new_pwd").clear().type("LOOOOONG");
    cy.get("@pwd_confirm").clear().type("LOOOOONG");
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing lower case letters");

    cy.get("@new_pwd").clear().type("LoOoOoNg");
    cy.get("@pwd_confirm").clear().type("LoOoOoNg");
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing numbers");

    cy.get("@new_pwd").clear().type("LoO0OoNg");
    cy.get("@pwd_confirm").clear().type("LoO0OoNg");
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing special characters");

    cy.get("@new_pwd")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_PASSWORD") + "!");
    cy.get("@pwd_confirm")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_PASSWORD") + "!");
    cy.get("button").contains("Change").click();

    // test the form!
  });

  it("Login - PASSWORD EXPIRED", () => {
    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        actions: ["PASSWORD EXPIRED"],
        errors: ["Your password is expired, please change it"],
      },
    });

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

    cy.get("formly-validation-message")
      .eq(0)
      .contains("This field is required");
    cy.get("formly-validation-message")
      .eq(1)
      .contains("This field is required");

    cy.get("input[placeholder='Your new password']").as("new_pwd");
    cy.get("input[placeholder='Confirm your new password']").as("pwd_confirm");

    cy.get("@new_pwd").clear().type("short");
    cy.get("formly-validation-message")
      .eq(0)
      .contains("Should have at least 8 characters");
    cy.get("button").contains("Change").click();

    cy.get("@new_pwd").clear().type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("@pwd_confirm").clear().type("invalid");

    cy.get("formly-validation-message")
      .eq(0)
      .contains("The password does not match");
    cy.get("button").contains("Change").click();

    cy.get("@pwd_confirm").clear().type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Change").click();
    cy.checkalert("The new password cannot match the previous password");

    cy.get("@new_pwd").clear().type("loooooooong");
    cy.get("@pwd_confirm").clear().type("loooooooong");
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing upper case letters");

    cy.get("@new_pwd").clear().type("LOOOOONG");
    cy.get("@pwd_confirm").clear().type("LOOOOONG");
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing lower case letters");

    cy.get("@new_pwd").clear().type("LoOoOoNg");
    cy.get("@pwd_confirm").clear().type("LoOoOoNg");
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing numbers");

    cy.get("@new_pwd").clear().type("LoO0OoNg");
    cy.get("@pwd_confirm").clear().type("LoO0OoNg");
    cy.get("button").contains("Change").click();
    cy.checkalert("Password is too weak, missing special characters");

    cy.get("@new_pwd")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_PASSWORD") + "!");
    cy.get("@pwd_confirm")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_PASSWORD") + "!");
    cy.get("button").contains("Change").click();

    // test the form!
  });

  it("Login - TOTP", () => {
    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        actions: ["TOTP"],
        errors: ["You do not provided a valid second factor"],
      },
    });

    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("You do not provided a valid second factor");
    cy.get("div.card-header h4").contains("Provide the verification cod");
    cy.get("button").contains("Authorize").click();

    // fill the form! Not yet (re)implemented
  });

  it("Login - Unknown action", () => {
    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: {
        actions: ["invalid"],
        errors: ["invalid"],
      },
    });

    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Unrecognized response from server");
  });

  afterEach(() => {
    cy.server({ enable: false });
    // restore default password and logout? Only for successful logins
  });
});
