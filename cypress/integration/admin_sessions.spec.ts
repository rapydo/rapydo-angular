// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminSessions", () => {
  it("AdminSessions - with authentication", () => {
    cy.login();

    cy.visit("/app/admin/sessions");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/sessions");
    });

    // test... something
  });
});
