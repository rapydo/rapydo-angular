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

    cy.get('button:contains("Submit")').click();
    cy.get("formly-validation-message").contains("This field is required");

    cy.get("input[id=formly_11_input_email_0]").clear().type("invalid");
    cy.get('button:contains("Submit")').click();
    cy.get("formly-validation-message").contains("Invalid email address");

    cy.get("input[id=formly_11_input_email_0]")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("input[id=formly_11_input_password_1]").clear().type("short");
    cy.get('button:contains("Submit")').click();
    cy.get("formly-validation-message").contains(
      "Should have at least 8 characters"
    );

    cy.get("input[id=formly_11_input_password_1]").clear().type("looooong");
    cy.get("input[id=formly_11_input_name_2]").clear().type("SampleName");
    cy.get("input[id=formly_11_input_surname_3]").clear().type("SampleSurname");
    cy.get('button:contains("Submit")').click();

    // to be completed: should fail because DEFAULT_USERNAME already exists
  });
});
