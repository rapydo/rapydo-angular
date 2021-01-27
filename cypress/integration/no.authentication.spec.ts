// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("NoAuthentication", () => {
  it("Profile", () => {
    cy.visit("/app/profile");

    // Profile page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("ChangePassword", () => {
    cy.visit("/app/profile/changepassword");

    // ChangePassword page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("Sessions", () => {
    cy.visit("/app/profile/sessions");

    // Sessions page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("AdminUsers", () => {
    cy.visit("/app/admin/users");

    // AdminUsers page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("AdminGroups", () => {
    cy.visit("/app/admin/groups");

    // AdminGroups page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("AdminSessions", () => {
    cy.visit("/app/admin/sessions");

    // AdminSessions page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });

  it("AdminStats", () => {
    cy.visit("/app/admin/stats");

    // AdminStats page is restricted and you are automatically redirected to login page
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });
  });
});
