// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword, get_totp } from "../../fixtures/utilities";

describe("Login with TOTP", () => {
  if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
    const email = "aaaaaaaaaa000555" + Math.random() + "@sample.org";
    const pwd = getpassword(4);

    before(() => {
      // expired = false
      // init_user = false
      cy.createuser(email, pwd, false, false);
    });

    it("TOTP - change temporary password", () => {
      cy.visit("/app/login");

      cy.get("input[placeholder='Your username (email)']").type(email);
      cy.get("input[placeholder='Your password']").type(pwd);
      cy.get("button").contains("Login").click();

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/login");
      });

      cy.checkalert("You do not provided a valid verification code");

      cy.get("div.card-header h4").contains(
        "Configure Two-Factor with Google Auth"
      );
      cy.get("div.card-header.bg-warning h4").contains(
        "Provide the verification code"
      );

      cy.checkalert("Please change your temporary password");

      pwd += "!";

      cy.get('input[placeholder="Your new password"]').type(pwd);
      cy.get('input[placeholder="Confirm your new password"]').type(pwd);

      // Authorization code is missing
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "This field is required");

      // Not a code, test with a short string
      cy.get("input[placeholder='TOTP verification code']").clear().type("a");
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Not a code, test with a short number
      cy.get("input[placeholder='TOTP verification code']").clear().type("0");
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Not a code, test with a long string
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type("aaaaaaa");
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Not a code, test with a long number
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type("9999999");
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Test a wrong code
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type("000000");
      cy.get("button").contains("Authorize").click();
      cy.checkalert("Verification code is not valid");

      // Code is now correct
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.get("button").contains("Authorize").click();

      if (Cypress.env("ALLOW_TERMS_OF_USE")) {
        cy.get("div.modal-footer h4").contains(
          "Do you accept our Terms of Use?"
        );
        cy.get("div.modal-footer button").first().contains("YES").click();
      }

      // Verify the login by checking the profile
      cy.goto_profile();

      cy.get("table").find("td").contains(email);

      cy.logout();
    });

    it("TOTP - login", () => {
      // Let's test the second login (temporary password already changed)
      cy.visit("/app/login");

      cy.get("input[placeholder='Your username (email)']").type(email);
      cy.get("input[placeholder='Your password']").type(pwd);
      cy.intercept("POST", "/auth/login").as("login");
      cy.get("button").contains("Login").click();
      cy.wait("@login");

      cy.get("input[placeholder='Your password']").should("not.exist");

      cy.get("div.card-header.bg-warning h4").contains(
        "Provide the verification code"
      );

      // Authorization code is missing
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "This field is required");

      // Not a code, test with a short string
      cy.get("input[placeholder='TOTP verification code']").clear().type("a");
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Not a code, test with a short number
      cy.get("input[placeholder='TOTP verification code']").clear().type("0");
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Not a code, test with a long string
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type("aaaaaaa");
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Not a code, test with a long number
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type("9999999");
      cy.get("button").contains("Authorize").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Test a wrong code
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type("000000");
      cy.get("button").contains("Authorize").click();
      cy.checkalert("Verification code is not valid");

      // Code is now correct
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());

      cy.get("button").contains("Authorize").click();

      cy.goto_profile();

      cy.get("table").find("td").contains(email);
    });

    it("TOTP - change password", () => {
      cy.visit("/app/login");

      cy.get("input[placeholder='Your username (email)']").type(email);
      cy.get("input[placeholder='Your password']").type(pwd);
      cy.intercept("POST", "/auth/login").as("login");
      cy.get("button").contains("Login").click();
      cy.wait("@login");

      cy.get("input[placeholder='Your password']").should("not.exist");

      cy.get("div.card-header h4").contains("Provide the verification code");
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());

      cy.get("button").contains("Authorize").click();

      cy.goto_profile();
      // Let's test the password change
      cy.get("a:contains('CHANGE')").click();

      cy.get('input[placeholder="Type here your current password"]')
        .clear()
        .type(pwd);
      cy.get('input[placeholder="Type the desidered new password"]')
        .clear()
        .type(pwd + "!");
      cy.get(
        'input[placeholder="Type again the new password for confirmation"]'
      )
        .clear()
        .type(pwd + "!");

      // Authorization code is missing
      cy.get("button:contains('Submit')").click();
      cy.checkvalidation(0, "This field is required");

      // Not a code, test with a short string
      cy.get("input[placeholder='TOTP verification code']").clear().type("a");
      cy.get("button:contains('Submit')").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Not a code, test with a short number
      cy.get("input[placeholder='TOTP verification code']").clear().type("0");
      cy.get("button:contains('Submit')").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Not a code, test with a long string
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type("aaaaaaa");
      cy.get("button:contains('Submit')").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Not a code, test with a long number
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type("9999999");
      cy.get("button:contains('Submit')").click();
      cy.checkvalidation(0, "Invalid verification code (expected 6 digits)");

      // Test a wrong code
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type("000000");
      cy.get("button:contains('Submit')").click();
      cy.checkalert("Verification code is not valid");

      // Code is now correct
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.intercept("PUT", "/auth/profile").as("changed");
      cy.get("button:contains('Submit')").click();
      cy.wait("@changed");
      cy.checkalert("Password successfully changed");

      pwd += "!";

      // With TOTP after password change the user has to login again
      // Automatic login with new password is not possible due to the TOTP request
      cy.get("div.card-header h4").contains("Login");

      cy.get("input[placeholder='Your username (email)']").type(email);
      cy.get("input[placeholder='Your password']").type(pwd);

      cy.intercept("POST", "/auth/login").as("login");
      cy.get("button").contains("Login").click();
      cy.wait("@login");

      cy.get("div.card-header.bg-warning h4").contains(
        "Provide the verification code"
      );
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());

      cy.get("button").contains("Authorize").click();

      cy.goto_profile();

      cy.get("table").find("td").contains(email);
    });

    after(() => {
      cy.logout();

      cy.login();
      cy.deleteuser(email);
    });
  }
});
