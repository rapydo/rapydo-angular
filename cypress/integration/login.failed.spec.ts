// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("FailedLogin", () => {
  beforeEach(() => {
    cy.visit("/app/profile");
    cy.closecookielaw();

    // Profile page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    // The URL contain a reference to the previous page (/app/profile)
    cy.url().should("include", "/app/login");
    cy.url().should("include", "?returnUrl=%2Fapp%2Fprofile");
    cy.get("div.card-header h4").contains("Login");
  });

  it("Login - missing or wrong credentials", () => {
    // Missing credentials
    cy.get("input[placeholder='Your username (email)']");
    cy.get("input[placeholder='Your password']");
    cy.get("button").contains("Login").click();
    cy.checkvalidation(0, "This field is required");

    // Providing a non-email username
    cy.get("input[placeholder='Your username (email)']")
      .clear()
      .type("invalid");
    cy.get("button").contains("Login").click();
    cy.checkvalidation(0, "Invalid email address");

    // Username is good, password is missing
    cy.get("input[placeholder='Your username (email)']")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("button").contains("Login").click();
    cy.checkvalidation(0, "This field is required");

    // Username is good, password is wrong
    cy.get("input[placeholder='Your password']").clear().type("invalid");
    cy.get("button").contains("Login").click();
    cy.checkalert("Invalid username or password");

    // Password is good, username is wrong
    cy.get("input[placeholder='Your username (email)']")
      .clear()
      .type("invalid@user.name");
    cy.get("input[placeholder='Your password']")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Login").click();
    cy.checkalert("Invalid username or password");
  });

  it("Backend errors", () => {
    cy.get("input[placeholder='Your username (email)']")
      .clear()
      .type("invalid@user.name");
    cy.get("input[placeholder='Your password']")
      .clear()
      .type("invalid-password");

    // cy.intercept("POST", "/auth/login", {
    //   statusCode: 409,
    //   body: "Stubbed login error",
    // }).as("login1");

    // Cypress is still not able to override intercept..
    // Cannot set two intercepts on the same endpoint :-(
    cy.server();

    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 404,
      response: "Stubbed login error",
    });

    cy.get("button").contains("Login").click();
    // cy.wait("@login1");
    cy.checkalert(
      "Unable to login due to a server error. If this error persists please contact system administrators"
    );

    // cy.intercept("POST", "/auth/login", {
    //   statusCode: 404,
    //   body: "Stubbed login error",
    // }).as("login2");

    cy.route({
      method: "POST",
      url: "/auth/login",
      status: 409,
      response: "Stubbed login error",
    });

    cy.get("button").contains("Login").click();
    // cy.wait("@login2");
    cy.checkalert("Stubbed login error");
    cy.server({ enable: false });
  });

  afterEach(() => {
    // You are still on the login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });
});
