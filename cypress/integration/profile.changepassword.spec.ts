// This is to silence ESLint about undefined cy
/*global cy*/

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

    // test... something

    // Go back
    cy.get("button").contains("Cancel").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });
  });
});
