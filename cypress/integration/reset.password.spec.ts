// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("ResetPassword", () => {
  if (Cypress.env("ALLOW_PASSWORD_RESET")) {
    const email = "aaaaaaaaaa000222@sample.org";
    const pwd = "Looooong!";

    beforeEach(() => {
      cy.login();

      cy.createuser(email, pwd);

      cy.logout();
    });

    it("Reset", () => {
      cy.visit("/app/login");
      cy.closecookielaw();

      cy.get('a:contains("Click here")').click();

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/public/reset");
      });

      cy.get("div.card-header h4").contains("Reset your password");

      cy.visit("/public/reset");
      cy.closecookielaw();
      cy.get("div.card-header h4").contains("Reset your password");

      cy.get("button:contains('Submit request')").click();
      cy.checkvalidation(0, "This field is required");

      cy.get(
        'input[placeholder="Type here your email address to receive the reset link"]'
      ).as("email");

      cy.get("@email").clear().type("invalid");
      cy.get("button:contains('Submit request')").click();
      cy.checkvalidation(0, "Invalid email address");

      cy.get("@email").clear().type("invalid@sample.com");
      cy.get("button:contains('Submit request')").click();

      cy.checkalert(
        "Sorry, invalid@sample.com is not recognized as a valid username"
      );

      cy.intercept("POST", "/auth/reset").as("reset");

      cy.get("@email").clear().type(email);
      cy.get("button:contains('Submit request')").click();

      cy.wait("@reset");

      cy.get("div.card-header h4").contains("Reset your password");
      cy.get("div.card-block").contains(
        "We'll send instructions to the email provided if it's associated with an account. Please check your spam/junk folder."
      );

      cy.intercept("PUT", "/auth/reset/token-received-by-email").as("validate");

      cy.visit("/public/reset/token-received-by-email");

      cy.wait("@validate");

      cy.get("div.card-header h4").contains("Invalid request");
      cy.get("div.card-block").contains("Invalid reset token");

      cy.getmail().then((body) => {
        let re = /.*https?:\/\/.*\/reset\/(.*)$/;
        var token = body.match(re);

        cy.intercept("PUT", "/auth/reset/" + token[1]).as("validate");
        cy.visit("/public/reset/" + token[1]);
        cy.wait("@validate");

        cy.get("div.card-header h4").contains("Change your password");

        cy.get("button:contains('Submit')").click();

        cy.checkvalidation(0, "This field is required");
        cy.checkvalidation(1, "This field is required");

        cy.get('input[placeholder="Type here your new password"]').as(
          "new_password"
        );
        cy.get(
          'input[placeholder="Type again your new password for confirmation"]'
        ).as("confirm_password");

        cy.get("@new_password").clear().type("short");
        cy.get("button:contains('Submit')").click();

        cy.checkvalidation(0, "Should have at least 8 characters");
        cy.checkvalidation(1, "This field is required");

        cy.get("@new_password").clear().type("loooooong");
        cy.get("@confirm_password").clear().type("wrong");

        cy.checkvalidation(0, "Password not matching");

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

        cy.get("@new_password").clear().type(pwd);
        cy.get("@confirm_password").clear().type(pwd);
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
        cy.intercept("PUT", "/auth/reset/" + token[1]).as("validate");
        cy.visit("/public/reset/" + token[1]);
        cy.wait("@validate");

        cy.get("div.card-header h4").contains("Invalid request");
        cy.get("div.card-block").contains("Invalid reset token");
        cy.checkalert("Invalid reset token");

        cy.visit("/app/login");
        cy.intercept("POST", "/auth/login").as("login");
        cy.get("input[placeholder='Your username (email)']")
          .clear()
          .type(email);
        cy.get("input[placeholder='Your password']")
          .clear()
          .type(newPassword + "{enter}");

        cy.wait("@login");

        cy.visit("/app/profile");
        cy.location().should((location) => {
          expect(location.pathname).to.eq("/app/profile");
        });
        cy.get("table").find("td").contains(email);

        // // Replaced with this other test:
        // cy.logout();

        // cy.login(email, newPassword);
      });
    });

    afterEach(() => {
      cy.logout();

      cy.login();
      cy.deleteuser(email);
    });
  }
});
