// This is to silence ESLint about undefined cy
/*global cy*/

describe("ResetPassword", () => {
  it("Reset form", () => {
    cy.visit("/app/login");

    cy.get('a:contains("Click here")').click();
    cy.get(".card-header").contains("Reset your password");

    cy.visit("/public/reset");
    cy.get(".card-header").contains("Reset your password");

    cy.get("button:contains('Submit request')").click();
    cy.get("formly-validation-message").contains("This field is required");

    cy.get("input[id=formly_1_input_reset_email_0]").clear().type("invalid");
    cy.get("button:contains('Submit request')").click();
    cy.get("formly-validation-message").contains("Invalid email address");

    cy.get("input[id=formly_1_input_reset_email_0]")
      .clear()
      .type("invalid@sample.com");
    cy.get("button:contains('Submit request')").click();

    cy.get("div[role=alertdialog]")
      .contains(
        "Sorry, invalid@sample.com is not recognized as a valid username"
      )
      .click({ force: true });

    cy.get("input[id=formly_1_input_reset_email_0]")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("button:contains('Submit request')").click();
    cy.get(".card-header").contains("Reset your password");
    cy.get(".card-block").contains(
      "You will shortly receive an email with a link to a page where you can create a new password, please check your spam/junk folder."
    );

    cy.visit("/public/reset/token-received-by-email");
    cy.get(".card-header").contains("Invalid request");
    cy.get(".card-block").contains("Invalid reset token");
  });
});
