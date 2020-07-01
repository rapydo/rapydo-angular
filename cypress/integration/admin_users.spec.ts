// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminUsers", () => {
  it("AdminUsers - without authentication", () => {
    cy.visit("/app/admin/users");

    // AdminUsers page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("AdminUsers - with authentication", () => {
    cy.login();

    cy.visit("/app/admin/users");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/users");
    });

    cy.get('button:contains("new user")').click();
    cy.get('button:contains("Close")').click({ force: true });
    // test... something
  });
});
