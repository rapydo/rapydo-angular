// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("ResetPassword", () => {
  it("Reset", () => {
    cy.visit("/app/login");

    cy.get('a:contains("Click here")').click();
    cy.wait(200);
    cy.get("div.card-header").contains("Reset your password");

    cy.visit("/public/reset");
    cy.closecookielaw();
    cy.get("div.card-header").contains("Reset your password");

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

    // APIs can respond in a long time (receive the request, validate the email, create the token, send the email...)
    // This wait may be removed if replace the page content with a spinner after the request...
    cy.wait(1000);

    cy.get("div.card-header").contains("Reset your password");
    cy.get("div.card-block").contains(
      "You will shortly receive an email with a link to a page where you can create a new password, please check your spam/junk folder."
    );

    cy.visit("/public/reset/token-received-by-email");
    // The page is modified after a short time, after the token is validated
    // This wait may be removed if replace the page content with a spinner...
    cy.wait(500);
    cy.get("div.card-header").contains("Invalid request");
    cy.get("div.card-block").contains("Invalid reset token");

    cy.getmail().then((body) => {
      let re = /.*https?:\/\/.*\/reset\/(.*)$/;
      var token = body.match(re);
      cy.visit("/public/reset/" + token[1]);

      cy.wait(500);
      cy.get("div.card-header").contains("Change your password");

      cy.get("button:contains('Submit')").click();

      cy.get("formly-validation-message")
        .eq(0)
        .contains("This field is required");
      cy.get("formly-validation-message")
        .eq(1)
        .contains("This field is required");

      cy.get('input[placeholder="Type here your new password"]').as("new_pwd");
      cy.get(
        'input[placeholder="Type again your new password for confirmation"]'
      ).as("pwd_confirm");

      cy.get("@new_pwd").clear().type("short");
      cy.get("button:contains('Submit')").click();

      cy.get("formly-validation-message")
        .eq(0)
        .contains("Should have at least 8 characters");
      cy.get("formly-validation-message")
        .eq(1)
        .contains("This field is required");

      cy.get("@new_pwd").clear().type("loooooong");
      cy.get("@pwd_confirm").clear().type("wrong");

      cy.get("formly-validation-message")
        .eq(0)
        .contains("Password not matching");

      cy.get("@pwd_confirm").clear().type("loooooong");
      // cy.get("button:contains('Submit')").click();
      // what is missing here is the real change password...
    });
  });
});
