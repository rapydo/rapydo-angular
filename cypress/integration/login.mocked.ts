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

    cy.checkalert("Please change your temporary password");
    cy.get("div.card-header h4").contains(
      "Please change your temporary password"
    );
    cy.get("button").contains("Change").click();

    // fill the form!
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

    cy.checkalert("Your password is expired, please change it");
    cy.get("div.card-header h4").contains(
      "Your password is expired, please change it"
    );
    cy.get("button").contains("Change").click();

    // fill the form!
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

    // fill the form!
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
