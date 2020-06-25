describe("Profile", () => {
  beforeEach(() => {
    cy.visit("app/profile");
  });

  it("cy.location() - get window.location", () => {
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("cy.url() - get the current URL", () => {
    cy.url().should("include", "/app/login");
    cy.url().should("include", "?returnUrl=%2Fapp%2Fprofile");
  });
});
