// This is to silence ESLint about undefined cy
/*global cy, Cypress*/
import { get_totp } from "../../fixtures/utilities";

describe("SuccessfulLogin", () => {
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

  it("Login - click on submit button", () => {
    cy.get("input[placeholder='Your password']").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD")
    );
    cy.get("input[placeholder='Your username (email)']").type(
      Cypress.env("AUTH_DEFAULT_USERNAME")
    );

    // cy.get("input[placeholder='Your password'][type='password']").should('not.have.value',Cypress.env("AUTH_DEFAULT_PASSWORD"));

    cy.get("i.clickable.toggle.fas.fa-eye-slash").click();

    cy.get("i.clickable.toggle.fas.fa-eye-slash").trigger("mousedown");

    // cy.get("input[placeholder='Your password']").should('have.value',Cypress.env("AUTH_DEFAULT_PASSWORD"));

    cy.get("i.clickable.toggle.fas.fa-eye").click();

    // cy.get("input[placeholder='Your password'][type='password']").should('not.have.value',Cypress.env("AUTH_DEFAULT_PASSWORD"));

    cy.get("button").contains("Login").click();

    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("div.card-header h4").contains(
        "Configure Two-Factor with Google Auth"
      );
      const token = get_totp();
      cy.get("input[placeholder='Generated TOTP']").type(token);
      cy.get("button").contains("Verify").click();
    }
  });

  it("Login - enter on password field", () => {
    cy.get("input[placeholder='Your username (email)']").type(
      Cypress.env("AUTH_DEFAULT_USERNAME")
    );
    cy.get("input[placeholder='Your password']").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD") + "{enter}"
    );
  });

  it("Login - enter on username field", () => {
    cy.get("input[placeholder='Your password']").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD")
    );
    cy.get("input[placeholder='Your username (email)']").type(
      Cypress.env("AUTH_DEFAULT_USERNAME") + "{enter}"
    );
  });

  afterEach(() => {
    // After the login you are automatically redirected to the profile
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.get("a").find(".fa-user");
    cy.get("table").find("td").contains(Cypress.env("AUTH_DEFAULT_USERNAME"));

    cy.logout();

    // After the logout you are automatically redirected to the default page...
    // more in generale not on the profile page
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/profile");
    });

    // If you enter the login page and your are logged in,
    // you will be automatically logged out

    cy.visit("/app/login");
    cy.visit("/app/profile");

    // You are now logged out and Profile page is restricted
    // => you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });
});
