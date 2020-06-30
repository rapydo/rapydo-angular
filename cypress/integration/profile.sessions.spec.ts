// This is to silence ESLint about undefined cy
/*global cy*/

describe("Sessions", () => {
  it("Sessions - without authentication", () => {
    cy.visit("/app/profile/sessions");

    // Sessions page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("Sessions - with authentication", () => {
    cy.login();

    cy.visit("/app/profile/sessions");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });

    cy.visit("/app/profile");

    cy.contains("View list of your open sessions").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });

    // test... something
  });
});
