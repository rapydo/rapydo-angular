describe("Profile", () => {
  it("Profile - without authentication", () => {
    cy.visit("/app/profile");

    // Profile page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("Profile - with authentication", () => {
    cy.login();

    cy.visit("/app/profile");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    // test... something
  });
});
