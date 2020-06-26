describe("Profile", () => {
  beforeEach(() => {
    cy.visit("app/profile");
  });

  // before(() => {
  //   let credentials = {
  //       username: Cypress.env('AUTH_DEFAULT_USERNAME'),
  //       password: Cypress.env('AUTH_DEFAULT_PASSWORD')
  //   }
  //   cy.request('POST', Cypress.env('API_URL')+'/auth/login', credentials)
  //       .its('body')
  //       .as('token')
  // });

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
