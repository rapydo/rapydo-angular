// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminUsers", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/app/admin/groups");

    cy.closecookielaw();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/groups");
    });
  });

  it("Create new group", () => {
    // Not implemented. Groups are optional (like in Mistral)
    // Option 1: also make these tests optional
    // Option 2: make groups enabled by default (alchemy and mongo implementation needed)
  });
});
