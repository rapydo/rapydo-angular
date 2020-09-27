// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("ChangePassword", () => {
  it("ChangePassword", () => {
    cy.login();

    cy.visit("/app/profile/changepassword");
    cy.closecookielaw();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });

    // Go back
    cy.get("button:contains('Cancel')").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.contains("Change your password").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });

    cy.get("button:contains('Submit')").click();
    cy.get("formly-validation-message").contains("This field is required");

    cy.get('input[placeholder="Type here your current password"]').as(
      "password"
    );
    cy.get('input[placeholder="Type here the desidered new password"]').as(
      "new_password"
    );
    cy.get(
      'input[placeholder="Type here again the desidered new password for confirmation"]'
    ).as("confirm_password");

    cy.get("@password").clear().type("wrong");
    cy.get("@new_password").clear().type("short");
    cy.get("formly-validation-message").contains(
      "Should have at least 8 characters"
    );
    cy.get("@new_password").clear().type("looooong");
    cy.get("@confirm_password").clear().type("short");
    cy.get("formly-validation-message").contains("The password does not match");
    cy.get("@confirm_password").clear().type("looooong");

    cy.get("button:contains('Submit')").click();
    cy.checkalert("Shorter than minimum length 8.");
    cy.get("@password").clear().type("wrong-password");

    cy.get("button:contains('Submit')").click();
    cy.checkalert(
      "Your request cannot be authorized, is current password wrong?"
    );

    cy.get("@password").clear().type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
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

    cy.get("@new_password").clear().type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("@confirm_password")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_PASSWORD"));
    cy.get("button:contains('Submit')").click();
    cy.checkalert("The new password cannot match the previous password");

    const newPassword = "LoO0OoNg!";
    cy.get("@new_password").clear().type(newPassword);
    cy.get("@confirm_password").clear().type(newPassword);

    // Check backend errors
    cy.server();
    cy.route({
      method: "PUT",
      url: "/auth/profile",
      status: 500,
      response: "Stubbed change password error",
    });

    cy.get("button:contains('Submit')").click();
    cy.checkalert("Stubbed change password error");
    cy.server({ enable: false });

    cy.get("button:contains('Submit')").click();
    cy.checkalert("Password successfully changed");

    cy.visit("/app/profile");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    // Restore the default password
    cy.pwdchange(
      Cypress.env("AUTH_DEFAULT_USERNAME"),
      newPassword,
      Cypress.env("AUTH_DEFAULT_PASSWORD"),
      false
    );
  });
});
