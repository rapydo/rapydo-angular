// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Registration", () => {
  if (Cypress.env("ALLOW_REGISTRATION")) {
    it("Registration", () => {
      cy.visit("/app/login");
      cy.closecookielaw();

      cy.contains("You don't have an account yet");
      cy.get('a:contains("Register here")').click();

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/public/register");
      });

      cy.get("div.card-header h4").contains("Register a new account");

      // Save form fields as aliases
      cy.get('input[placeholder="Type here your name"]').as("name");
      cy.get('input[placeholder="Type here your surname"]').as("surname");
      cy.get('input[placeholder="Type here your email address"]').as("email");
      cy.get('input[placeholder="Type here the desidered password"]').as(
        "password"
      );
      cy.get(
        'input[placeholder="Type again the desidered password for confirmation"]'
      ).as("confirmation");
      cy.get('button:contains("Register")').as("submit");

      // Submit empty form (validations errors for all required fields are expected)
      cy.get("@submit").click({ force: true });

      cy.checkvalidation(0, "This field is required");
      cy.checkvalidation(1, "This field is required");
      cy.checkvalidation(2, "This field is required");
      cy.checkvalidation(3, "This field is required");
      cy.checkvalidation(4, "This field is required");

      // Submit short inputs (validation errors on email and password are expected)
      cy.get("@name").clear().type("a");
      cy.get("@surname").clear().type("b");
      cy.get("@email").clear().type("c");
      cy.get("@password").clear().type("d");
      cy.get("@confirmation").clear().type("e");

      cy.get("@submit").click({ force: true });

      cy.checkvalidation(0, "Invalid email address");
      cy.checkvalidation(1, "Should have at least 8 characters");

      cy.get("@password").clear().type("12345678");
      cy.get("@confirmation").clear().type("23456789");
      cy.checkvalidation(1, "Password not matching");

      cy.get("@submit").click({ force: true });

      if (Cypress.env("ALLOW_TERMS_OF_USE")) {
        cy.contains("Acceptance is mandatory");

        cy.get("a").contains(" read)").click({ force: true });
        cy.get("button").contains("I read it").click({ force: true });

        // Accept all privacy boxes
        cy.get("formly-field-terms_of_use_checkbox")
          .get('input[type="checkbox"]')
          .each(($el, index, $list) => {
            cy.wrap($el).click({ force: true });
          });
      }

      // File extra fields
      // get custom fields added at project level:
      // foreach element select required input text/number still empty and fill them
      cy.get("input").each(($el, index, $list) => {
        if ($el.prop("required") && $el.val() === "") {
          if ($el.attr("type") === "text") {
            cy.wrap($el).type("a");
          } else if ($el.attr("type") === "number") {
            cy.wrap($el).type("1");
          }
        }
      });

      // Pick all the selects, included Groups and any other custom fields (like in IMC)
      if (Cypress.$("select").length) {
        cy.get("form")
          .find("select")
          .each(($el, index, $list) => {
            if ($el.prop("required")) {
              cy.wrap($el)
                .find("option")
                .eq(1)
                .then((element) => {
                  cy.wrap($el).select(element.val());
                });
            }
          });
      }

      cy.get("@submit").click({ force: true });

      // Validation is now ok, but sending an already existing user as username
      let newPassword = "looooong";
      cy.get("@email").clear().type(Cypress.env("AUTH_DEFAULT_USERNAME"));
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });

      cy.checkalert(
        "This user already exists: " + Cypress.env("AUTH_DEFAULT_USERNAME")
      );

      // Failures on password validation: missing upper case letters
      const newUser =
        "testuser" + Math.floor(Math.random() * 1000000) + "@sample.org";
      cy.get("@email").clear().type(newUser);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, missing upper case letters");

      // Failures on password validation: missing lower case letters
      newPassword = "LOOOOONG";
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, missing lower case letters");

      // Failures on password validation: missing numbers
      newPassword = "LoOoOoNg";
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, missing numbers");

      // Failures on password validation: missing numbers
      newPassword = "LoO0OoNg";
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, missing special characters");

      // That's all ok, let's create the user!
      newPassword = "LoO0OoNg!";
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("User successfully registered");

      cy.get("div.card-header h4").contains("Account registered");

      cy.contains(
        "User successfully registered. You will receive an email to confirm your registraton and activate your account"
      );

      cy.visit("/app/login");

      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(newUser);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(newPassword + "{enter}");

      cy.wait(1500);
      cy.get("div.card-header h4").contains("This account is not active");
      cy.get("div.card-block").contains("Didn't receive an activation link?");

      cy.get("a").contains("Click here to send again").click();

      cy.checkalert(
        "We are sending an email to your email address where you will find the link to activate your account"
      );

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/login");
      });
      cy.get("div.card-header h4").contains("Login");

      // also verify errors on reset
      cy.visit("/public/reset");
      cy.get("input[id=formly_1_input_reset_email_0]").clear().type(newUser);
      cy.get("button:contains('Submit request')").click();
      cy.checkalert("Sorry, this account is not active");

      cy.visit("/public/register/invalid");

      cy.get("div.card-header h4").contains("Invalid activation token");
      cy.get("div.card-block").contains(
        "This activation token is not valid and your request can not be satisfied."
      );

      cy.getmail().then((body) => {
        let re = /.*https?:\/\/.*\/register\/(.*)$/;
        var token = body.match(re);
        cy.visit("/public/register/" + token[1]);

        cy.location().should((location) => {
          expect(location.pathname).to.eq("/app/login");
        });

        cy.checkalert("User successfully activated");

        cy.visit("/public/register/" + token[1]);

        cy.get("div.card-header h4").contains("Invalid activation token");
        cy.get("div.card-block").contains(
          "This activation token is not valid and your request can not be satisfied."
        );
      });

      cy.visit("/app/login");

      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE"));

      cy.wait(2000);

      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(newUser);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(newPassword + "{enter}");

      if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === "True") {
        cy.get("div.card-header")
          .should("have.class", "bg-warning")
          .find("h4")
          .contains("Please change your temporary password");

        cy.get('input[placeholder="Your new password"]')
          .clear()
          .type(newPassword + "!");
        cy.get('input[placeholder="Confirm your new password"]')
          .clear()
          .type(newPassword + "!");
        cy.get('button:contains("Change")').click({ force: true });
      }

      // Prevent the login call to be cancelled
      // if response arrives too late and visit already changed the page
      cy.wait(1500);

      cy.visit("/app/profile");

      cy.get("table").find("td").contains(newUser);

      cy.visit("/app/admin/users");

      cy.checkalert(
        "Permission denied: you are not authorized to access this page"
      );

      cy.visit("/app/admin/sessions");

      cy.checkalert(
        "Permission denied: you are not authorized to access this page"
      );

      cy.logout();

      cy.wait(2000);

      // Login as admin to delete the user
      cy.login();

      cy.deleteuser(newUser);

      cy.visit("/app/login");

      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(newUser);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type("looooong{enter}");
      // cy.get("button").contains("Login").click();

      cy.checkalert("Invalid username or password");
    });
  } else {
    it("Registration not allowed", () => {
      cy.visit("/public/register");
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/public/register");
      });

      cy.get("div.card-header h4").contains("Register a new account");

      cy.contains("Account registration is not allowed");
    });
  }
});
