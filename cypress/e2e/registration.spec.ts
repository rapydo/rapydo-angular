// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import {
  getpassword,
  get_random_username,
  get_totp,
} from "../fixtures/utilities";

describe("Registration", () => {
  if (!Cypress.env("ALLOW_REGISTRATION")) {
    it("Registration not allowed", () => {
      cy.visit("/public/register");
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/public/register");
      });

      cy.get("ul.navbar-nav.ms-auto")
        .find("a:contains('Sign up')")
        .should("not.exist");

      cy.get("div.card-header h1").contains("Registration is not allowed");

      cy.contains("Account registration is not allowed");
    });
  } else {
    // do not directly create the random values here,
    // otherwise will be always the same on each test repetition!
    // do not generate it in the before() block, or will be not re-created on repetitions
    let newUser;
    let newPassword = "to-be-generated";

    it("Registration", () => {
      newUser = get_random_username("testregistration");

      cy.visit("/app/login");
      cy.closecookielaw();

      // Login -> Register
      cy.contains("You don't have an account yet");
      cy.get('a:contains("Register here")').click();

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/public/register");
      });

      cy.visit("/app/login");

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/login");
      });

      cy.get("ul.navbar-nav.ms-auto").find("a:contains('Sign up')").click();

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/public/register");
      });

      // Register -> Login
      cy.contains("Already have an account?");
      // find the sign in the in the card header to prevent to pick the one in the navbar
      cy.get("div.card-header").find('a:contains("Sign in")').click();

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/login");
      });

      // direct -> Register
      cy.visit("/public/register");

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/public/register");
      });

      cy.get("div.card-header h1").contains("Register a new account");

      // Save form fields as aliases
      cy.get('input[placeholder="Type here your name"]').as("name");
      cy.get('input[placeholder="Type here your surname"]').as("surname");
      cy.get('input[placeholder="Type here your email address"]').as("email");
      cy.get('input[placeholder="Type here the desidered password"]').as(
        "password",
      );
      cy.get(
        'input[placeholder="Type again the desidered password for confirmation"]',
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
      cy.checkvalidation(
        1,
        "Should have at least " +
          Cypress.env("AUTH_MIN_PASSWORD_LENGTH") +
          " characters",
      );

      cy.get("@password")
        .clear()
        .type(getpassword(4), { parseSpecialCharSequences: false });
      cy.get("@confirmation")
        .clear()
        .type(getpassword(4), { parseSpecialCharSequences: false });
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
      if (Cypress.$("ng-select").length) {
        cy.get("form")
          .find("ng-select")
          .each(($el, index, $list) => {
            cy.wrap($el).find("input").click({ force: true });
            cy.wrap($el).find("div.ng-option").eq(1).click({ force: true });
            // if ($el.prop("required")) {
            //   cy.wrap($el)
            //     .find("option")
            //     .eq(1)
            //     .then((element) => {
            //       cy.wrap($el).select(element.val());
            //     });
            // }
          });
      }

      cy.get("@submit").click({ force: true });

      // Validation is now ok, but sending an already existing user as username
      newPassword = getpassword(1);
      cy.get("@email").clear().type(Cypress.env("AUTH_DEFAULT_USERNAME"));
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });

      cy.checkalert(
        "This user already exists: " + Cypress.env("AUTH_DEFAULT_USERNAME"),
      );

      // Failures on password validation: missing upper case letters
      cy.get("@email").clear().type(newUser);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, missing upper case letters");

      // Failures on password validation: missing lower case letters
      newPassword = newPassword.toUpperCase();
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, missing lower case letters");

      // Failures on password validation: missing numbers
      newPassword = getpassword(2);
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, missing numbers");

      // Failures on password validation: missing numbers
      newPassword = getpassword(3);
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, missing special characters");

      // Failures on password validation: containing email, name or surname
      cy.get("@name").clear().type("Albert");
      cy.get("@surname").clear().type("Einstein");

      newPassword = newUser + "AADwfef331!!";
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, can't contain your email address");

      newPassword = "AAlbertDwfef331!!";
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, can't contain your name");

      newPassword = "Ar52sEinSTein!sdfF=";
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("Password is too weak, can't contain your name");

      // That's all ok, let's create the user!
      newPassword = getpassword(4);
      cy.get("@password").clear().type(newPassword);
      cy.get("@confirmation").clear().type(newPassword);
      cy.get("@submit").click({ force: true });
      cy.checkalert("User successfully registered");

      cy.get("div.card-header h1").contains("Account registered");

      cy.contains(
        "User successfully registered. You will receive an email to confirm your registraton and activate your account",
      );
    });

    it("Activation", () => {
      cy.visit("/app/login");
      cy.closecookielaw();

      cy.intercept("POST", "/auth/login").as("login");

      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(newUser);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(newPassword, { parseSpecialCharSequences: false });
      cy.get("button").contains("Login").click();

      cy.wait("@login");

      cy.get("div.card-header.bg-warning h1").contains(
        "This account is not active",
      );
      cy.get("div.card-body").contains("Didn't receive an activation link?");

      cy.get("a").contains("Click here to send again").click({ force: true });

      cy.checkalert(
        "We are sending an email to your email address where you will find the link to activate your account",
      );

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/login");
      });
      cy.get("div.card-header h1").contains("Login");

      // also verify errors on reset
      cy.visit("/public/reset");
      cy.get("input[id=formly_1_input_reset_email_0]").clear().type(newUser);
      cy.get("button:contains('Submit request')").click();
      cy.checkalert("Sorry, this account is not active");

      cy.visit("/public/register/invalid");

      cy.get("div.card-header h1").contains("Invalid activation token");
      cy.get("div.card-body").contains(
        "This activation token is not valid and your request cannot be satisfied.",
      );

      cy.getmail().then((body) => {
        let re = /.*https?:\/\/.*\/register\/([A-Za-z0-9-\.\+_]+)[\s\S]*$/;
        var token = body.match(re);

        cy.visit("/public/register/" + token[1]);

        cy.location().should((location) => {
          expect(location.pathname).to.eq("/app/login");
        });

        cy.checkalert("User successfully activated");

        cy.visit("/public/register/" + token[1]);

        cy.get("div.card-header h1").contains("Invalid activation token");
        cy.get("div.card-body").contains(
          "This activation token is not valid and your request cannot be satisfied.",
        );
      });
    });
    it("Access", () => {
      cy.visit("/app/login");

      cy.intercept("POST", "/auth/login").as("login2");

      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(newUser);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(newPassword, { parseSpecialCharSequences: false });
      cy.get("button").contains("Login").click();
      cy.wait("@login2");
      cy.wait(50);

      if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
        cy.get("div.card-header h1").contains(
          "Configure Two-Factor with Google Authenticator",
        );

        cy.get("input[placeholder='Your new password']").type(
          newPassword + "!",
        );
        cy.get("input[placeholder='Confirm your new password']").type(
          newPassword + "!",
        );
        cy.get("input[placeholder='TOTP verification code']").type(get_totp());

        cy.get("button").contains("Authorize").click();
      } else if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === 1) {
        cy.get("div.card-header.bg-warning h1").contains(
          "Please change your temporary password",
        );

        cy.checkalert("Please change your temporary password");

        cy.get('input[placeholder="Your new password"]')
          .clear()
          .type(newPassword + "!");
        cy.get('input[placeholder="Confirm your new password"]')
          .clear()
          .type(newPassword + "!");
        cy.get('button:contains("Change")').click({ force: true });
      }

      cy.goto_profile();

      cy.get("table").find("td").contains(newUser);

      cy.visit("/app/admin/users");

      cy.checkalert(
        "Permission denied: you are not authorized to access this page",
      );

      cy.visit("/app/admin/sessions");

      cy.checkalert(
        "Permission denied: you are not authorized to access this page",
      );
    });

    after(() => {
      cy.login();

      cy.deleteuser(newUser);
    });
  }
});
