// This is to silence ESLint about undefined cy
/*global cy*/

describe("FailedLogin", () => {
  beforeEach(() => {
    cy.visit("/app/profile");

    // Close the cookie law banner
    cy.get('button:contains("Ok, got it")').click();

    // Profile page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    // The URL contain a reference to the previous page (/app/profile)
    cy.url().should("include", "/app/login");
    cy.url().should("include", "?returnUrl=%2Fapp%2Fprofile");
  });

  it("Login - missing or wrong credentials", () => {
    // Missing credentials
    cy.get("input[id=formly_2_input_username_0]");
    cy.get("input[id=formly_2_input_password_1]");
    cy.get("button").contains("Login").click();
    cy.get("formly-validation-message").contains("This field is required");

    // Providing a non-email username
    cy.get("input[id=formly_2_input_username_0]").clear().type("invalid");
    cy.get("button").contains("Login").click();
    cy.get("formly-validation-message").contains("Invalid email address");

    // Username is good, password is missing
    cy.get("input[id=formly_2_input_username_0]")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("button").contains("Login").click();
    cy.get("formly-validation-message").contains("This field is required");

    // Username is good, password is wrong
    cy.get("input[id=formly_2_input_password_1]").clear().type("invalid");
    cy.get("button").contains("Login").click();
    cy.get("div[role=alertdialog]")
      .contains("Invalid username or password")
      .click();

    // Password is good, username is wrong
    cy.get("input[id=formly_2_input_username_0]")
      .clear()
      .type("invalid@user.name");
    cy.get("input[id=formly_2_input_password_1]")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button").contains("Login").click();
    cy.get("div[role=alertdialog]")
      .contains("Invalid username or password")
      .click();
  });

  afterEach(() => {
    // You are still on the login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });
});
