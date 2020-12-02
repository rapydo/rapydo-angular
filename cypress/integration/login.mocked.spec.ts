// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Mocked logins", () => {
  beforeEach(() => {
    cy.visit("/app/login");
    cy.closecookielaw();

    cy.server();

    cy.get("input[placeholder='Your username (email)']").as("user");
    cy.get("input[placeholder='Your password']").as("pwd");
  });

  it("Login - Account not active", () => {
    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 403,
      response: "Sorry, this account is not active",
    });

    cy.get("@user").type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@pwd").type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    // h4 is changed after a while. Without a wait the check will get the previous
    // div.card-header h4 == Login
    // should be solved by setting a spinner before deciding which h4 to show on the page
    cy.wait(400);

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

    cy.get("@user").type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@pwd").type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Unrecognized response from server");
    cy.checkalert("Please change your temporary password");

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

    const current_pwd = Cypress.env("AUTH_DEFAULT_PASSWORD");
    const new_pwd = Cypress.env("AUTH_DEFAULT_PASSWORD") + "!";

    cy.get("@user").type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@pwd").type(current_pwd);
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

    cy.checkvalidation(0, "This field is required");
    cy.checkvalidation(1, "This field is required");

    cy.get("input[placeholder='Your new password']").as("new_pwd");
    cy.get("input[placeholder='Confirm your new password']").as("pwd_confirm");

    cy.get("@new_pwd").clear().type("short");
    cy.checkvalidation(0, "Should have at least 8 characters");
    cy.get("button").contains("Change").click();

    cy.get("@new_pwd").clear().type(current_pwd);
    cy.get("@pwd_confirm").clear().type("invalid");

    cy.checkvalidation(0, "The password does not match");
    cy.get("button").contains("Change").click();

    cy.get("@pwd_confirm").clear().type(current_pwd);
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

    cy.get("@new_pwd").clear().type(new_pwd);
    cy.get("@pwd_confirm").clear().type(new_pwd);

    cy.get("button").contains("Change").click();
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

    // Password changed by the previous test (FIRST LOGIN)
    // This test (PASSWORD EXPIRED) will restore the default password at the end
    const current_pwd = Cypress.env("AUTH_DEFAULT_PASSWORD") + "!";
    const new_pwd = Cypress.env("AUTH_DEFAULT_PASSWORD");

    cy.get("@user").type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@pwd").type(current_pwd);
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
    cy.checkvalidation(0, "Should have at least 8 characters");
    cy.get("button").contains("Change").click();

    cy.get("@new_pwd").clear().type(current_pwd);
    cy.get("@pwd_confirm").clear().type("invalid");

    cy.checkvalidation(0, "The password does not match");
    cy.get("button").contains("Change").click();

    cy.get("@pwd_confirm").clear().type(current_pwd);
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

    // This will restore the default password
    cy.get("@new_pwd").clear().type(new_pwd);
    cy.get("@pwd_confirm").clear().type(new_pwd);
    cy.get("button").contains("Change").click();
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

    cy.get("@user").type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@pwd").type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
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

    cy.get("@user").type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@pwd").type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
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
