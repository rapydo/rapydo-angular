// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminUsers", () => {
  it("AdminUsers - without authentication", () => {
    cy.visit("/app/admin/users");

    // AdminUsers page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("AdminUsers - with authentication", () => {
    cy.login();

    cy.visit("/app/admin/users");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/users");
    });

    cy.get('button:contains("new user")').click();
    cy.get('button:contains("Close")').click({ force: true });

    cy.get('button:contains("new user")').click();

    cy.get('button:contains("Submit")').click({ force: true });
    cy.get("formly-validation-message").contains("This field is required");

    cy.get("input").eq(0).clear().type("invalid");
    cy.get('button:contains("Submit")').click({ force: true });
    cy.get("formly-validation-message").contains("Invalid email address");

    cy.get("input").eq(0).clear().type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("input").eq(1).clear().type("short");
    cy.get('button:contains("Submit")').click({ force: true });
    cy.get("formly-validation-message").contains(
      "Should have at least 8 characters"
    );

    cy.get("input").eq(1).clear().type("looooong");
    cy.get("input").eq(2).clear().type("SampleName");
    cy.get("input").eq(3).clear().type("SampleSurname");
    cy.get('button:contains("Submit")').click({ force: true });

    cy.get("div[role=alertdialog]")
      .contains(
        "Email already exists with value: " +
          Cypress.env("AUTH_DEFAULT_USERNAME")
      )
      .click({ force: true });
    cy.get("input").eq(0).clear().type("new-user@sample.org");
    cy.get('button:contains("Submit")').click({ force: true });

    cy.get("div[role=alertdialog]")
      .contains("Confirmation: user successfully created")
      .click({ force: true });

    cy.get('td:contains("new-user@sample.org")');
  });
});
