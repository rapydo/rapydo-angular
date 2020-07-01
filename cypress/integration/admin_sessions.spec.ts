// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminSessions", () => {
  it("AdminSessions - without authentication", () => {
    cy.visit("/app/admin/sessions");

    // AdminSessions page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("AdminSessions - with authentication", () => {
    cy.login();

    cy.visit("/app/admin/sessions");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/sessions");
    });

    // test... something
  });
});
