describe("Responsive tests", () => {
  it("Responsive navbar", () => {
    cy.visit("/app/login");

    cy.closecookielaw();

    cy.viewport(600, 400);

    cy.visit("/app/login");

    cy.wait(2000);
  });
});
