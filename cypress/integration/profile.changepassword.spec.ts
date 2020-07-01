// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("ChangePassword", () => {
  it("ChangePassword - without authentication", () => {
    cy.visit("/app/profile/changepassword");

    // ChangePassword page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("ChangePassword - with authentication", () => {
    cy.login();

    cy.visit("/app/profile/changepassword");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });

    cy.visit("/app/profile");

    cy.contains("Change your password").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });

    cy.get("button:contains('Submit')").click();
    cy.get("formly-validation-message").contains("This field is required");

    cy.get("input[id=formly_3_input_currentPwd_0]").clear().type("wrong");
    cy.get("input[id=formly_3_input_newPwd_1]").clear().type("short");
    cy.get("formly-validation-message").contains(
      "Should have at least 8 characters"
    );
    cy.get("input[id=formly_3_input_newPwd_1]").clear().type("looooong");
    cy.get("input[id=formly_3_input_confirmPwd_2]").clear().type("short");
    cy.get("formly-validation-message").contains("The password does not match");
    cy.get("input[id=formly_3_input_confirmPwd_2]").clear().type("looooong");

    cy.get("button:contains('Submit')").click();
    cy.get("div[role=alertdialog]")
      .contains("Shorter than minimum length 8.")
      .click({ force: true });
    cy.get("input[id=formly_3_input_currentPwd_0]")
      .clear()
      .type("wrong-password");

    cy.get("button:contains('Submit')").click();
    cy.get("div[role=alertdialog]")
      .contains("Your request cannot be authorized, is current password wrong?")
      .click({ force: true });

    cy.get("input[id=formly_3_input_currentPwd_0]")
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_PASSWORD"));

    // to be completed

    // Go back
    cy.get("button:contains('Cancel')").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });
  });
});
