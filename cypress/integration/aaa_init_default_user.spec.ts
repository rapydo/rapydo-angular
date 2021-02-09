// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Init user", () => {
  it("Login via form to change first password / setup TOTP if needed", () => {
    // default username/password and via_form = true
    cy.login(null, null, true);
  });
});
