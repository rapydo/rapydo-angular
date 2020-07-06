// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("ResetPassword", () => {
  if (Cypress.env("ALLOW_PASSWORD_RESET")) {
    it("Reset", () => {
      cy.visit("/app/login");

      cy.get('a:contains("Click here")').click();
      cy.wait(200);
      cy.get("div.card-header h4").contains("Reset your password");

      cy.visit("/public/reset");
      cy.closecookielaw();
      cy.get("div.card-header h4").contains("Reset your password");

      cy.get("button:contains('Submit request')").click();
      cy.get("formly-validation-message").contains("This field is required");

      cy.get(
        'input[placeholder="Type here your email address to receive the reset link"]'
      ).as("email");

      cy.get("@email").clear().type("invalid");
      cy.get("button:contains('Submit request')").click();
      cy.get("formly-validation-message").contains("Invalid email address");

      cy.get("@email").clear().type("invalid@sample.com");
      cy.get("button:contains('Submit request')").click();

      cy.checkalert(
        "Sorry, invalid@sample.com is not recognized as a valid username"
      );

      cy.get("@email").clear().type(Cypress.env("AUTH_DEFAULT_USERNAME"));
      cy.get("button:contains('Submit request')").click();

      // APIs can respond in a long time (receive the request, validate the email, create the token, send the email...)
      // This wait may be removed if replace the page content with a spinner after the request...
      cy.wait(1000);

      cy.get("div.card-header h4").contains("Reset your password");
      cy.get("div.card-block").contains(
        "You will shortly receive an email with a link to a page where you can create a new password, please check your spam/junk folder."
      );

      cy.visit("/public/reset/token-received-by-email");
      // The page is modified after a short time, after the token is validated
      // This wait may be removed if replace the page content with a spinner...
      cy.wait(500);
      cy.get("div.card-header h4").contains("Invalid request");
      cy.get("div.card-block").contains("Invalid reset token");

      cy.getmail().then((body) => {
        let re = /.*https?:\/\/.*\/reset\/(.*)$/;
        var token = body.match(re);
        cy.visit("/public/reset/" + token[1]);

        cy.wait(500);
        cy.get("div.card-header h4").contains("Change your password");

        cy.get("button:contains('Submit')").click();

        cy.get("formly-validation-message")
          .eq(0)
          .contains("This field is required");
        cy.get("formly-validation-message")
          .eq(1)
          .contains("This field is required");

        cy.get('input[placeholder="Type here your new password"]').as(
          "new_password"
        );
        cy.get(
          'input[placeholder="Type again your new password for confirmation"]'
        ).as("confirm_password");

        cy.get("@new_password").clear().type("short");
        cy.get("button:contains('Submit')").click();

        cy.get("formly-validation-message")
          .eq(0)
          .contains("Should have at least 8 characters");
        cy.get("formly-validation-message")
          .eq(1)
          .contains("This field is required");

        cy.get("@new_password").clear().type("loooooong");
        cy.get("@confirm_password").clear().type("wrong");

        cy.get("formly-validation-message")
          .eq(0)
          .contains("Password not matching");

        cy.get("@confirm_password").clear().type("loooooong");
        cy.get("button:contains('Submit')").click();
        cy.checkalert("Password is too weak, missing upper case letters");

        cy.get("@new_password").clear().type("LOOOOONG");
        cy.get("@confirm_password").clear().type("LOOOOONG");
        cy.get("button:contains('Submit')").click();
        cy.checkalert("Password is too weak, missing lower case letters");

        cy.get("@new_password").clear().type("LoOoOoNg");
        cy.get("@confirm_password").clear().type("LoOoOoNg");
        cy.get("button:contains('Submit')").click();
        cy.checkalert("Password is too weak, missing numbers");

        cy.get("@new_password").clear().type("LoO0OoNg");
        cy.get("@confirm_password").clear().type("LoO0OoNg");
        cy.get("button:contains('Submit')").click();
        cy.checkalert("Password is too weak, missing special characters");

        cy.get("@new_password")
          .clear()
          .type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
        cy.get("@confirm_password")
          .clear()
          .type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
        cy.get("button:contains('Submit')").click();
        cy.checkalert("The new password cannot match the previous password");

        const newPassword = "LoO0OoNg!";
        cy.get("@new_password").clear().type(newPassword);
        cy.get("@confirm_password").clear().type(newPassword);
        cy.get("button:contains('Submit')").click();
        cy.checkalert(
          "Password successfully changed. Please login with your new password"
        );

        cy.location().should((location) => {
          expect(location.pathname).to.eq("/app/login");
        });
        cy.get("div.card-header h4").contains("Login");

        // then test again the reset link to confirm the invalidation
        cy.visit("/public/reset/" + token[1]);
        cy.wait(1000);
        cy.get("div.card-header h4").contains("Invalid request");
        cy.get("div.card-block").contains("Invalid reset token");
        cy.checkalert("Invalid reset token");

        cy.visit("/app/login");
        cy.get("input[placeholder='Your username (email)']")
          .clear()
          .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
        cy.get("input[placeholder='Your password']")
          .clear()
          .type(newPassword + "{enter}");
        // cy.get("button").contains("Login").click();

        cy.visit("/app/profile");

        cy.location().should((location) => {
          expect(location.pathname).to.eq("/app/profile");
        });

        cy.get("table")
          .find("td")
          .contains(Cypress.env("AUTH_DEFAULT_USERNAME"));

        // Restore the default password
        cy.pwdchange(
          Cypress.env("AUTH_DEFAULT_USERNAME"),
          newPassword,
          Cypress.env("AUTH_DEFAULT_PASSWORD")
        );
      });
    });
  }
});
