// This is to silence ESLint about undefined cy
/*global cy*/

describe("ResetPassword", () => {
  it("Reset form", () => {
    cy.visit("/app/login");

    cy.get("a").contains("Click here.").click();

    cy.get("button").contains("Submit request").click();
    cy.get("formly-validation-message").contains("This field is required");

    cy.get("input[id=formly_2_input_reset_email_0]").clear().type("invalid");
    cy.get("button").contains("Submit request").click();
    cy.get("formly-validation-message").contains("Invalid email address");

    cy.get("input[id=formly_2_input_reset_email_0]")
      .clear()
      .type("invalid@sample.com");
    cy.get("button").contains("Submit request").click();

    cy.get("div[role=alertdialog]")
      .contains(
        "Sorry, invalid@sample.com is not recognized as a valid username"
      )
      .click();
  });
});
