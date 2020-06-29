describe("Profile", () => {
  beforeEach(() => {
    cy.visit("app/profile");

    cy.get('button:contains("Ok, got it")').click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.url().should("include", "/app/login");
    cy.url().should("include", "?returnUrl=%2Fapp%2Fprofile");
  });

  it("Login - click on submit button", () => {
    cy.get("input[id=formly_2_input_password_1]").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD")
    );
    cy.get("input[id=formly_2_input_username_0]").type(
      Cypress.env("AUTH_DEFAULT_USERNAME")
    );
    cy.get("button").contains("Login").click();
  });

  it("Login - enter on password field", () => {
    cy.get("input[id=formly_2_input_username_0]").type(
      Cypress.env("AUTH_DEFAULT_USERNAME")
    );
    cy.get("input[id=formly_2_input_password_1]").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD") + "{enter}"
    );
  });

  it("Login - enter on username field", () => {
    cy.get("input[id=formly_2_input_password_1]").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD")
    );
    cy.get("input[id=formly_2_input_username_0]").type(
      Cypress.env("AUTH_DEFAULT_USERNAME") + "{enter}"
    );
  });

  afterEach(() => {
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.get("a").find(".fa-sign-out-alt").parent().click();

    cy.get("button").contains("Confirm").click();
  });
});
