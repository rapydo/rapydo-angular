// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Sessions", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/app/profile/sessions");

    cy.closecookielaw();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });
  });

  it("Access from profile", () => {
    cy.visit("/app/profile");

    cy.contains("View list of your open sessions").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });

    // Go back
    cy.get("button").contains("Back to profile").click({ force: true });

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });
  });

  // This is the same as in admin_sessions.spec
  it("Sort, search, copy", () => {
    // Sort by Expiration, current token is now the last
    cy.get("span.datatable-header-cell-label").contains("Expiration").click();
    cy.get("datatable-body-row").first().find(".fa-trash");
    // Sort by Expiration, current token is now the first
    cy.get("span.datatable-header-cell-label").contains("Expiration").click();
    cy.get("datatable-body-row").first().find(".fa-trash").should("not.exist");

    cy.get("datatable-body-row").its("length").should("be.gte", 1);
    cy.get('input[placeholder="Type to filter sessions"]')
      .clear()
      .type("thisisinvalidforsure");
    cy.get("datatable-body-row").should("have.length", 0);

    // the user is not reported in the session list in profile... because the user is always che current!
    cy.get('input[placeholder="Type to filter sessions"]')
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("datatable-body-row").should("have.length", 0);

    cy.get('input[placeholder="Type to filter sessions"]').clear();

    // Filter by IP
    cy.get("datatable-body-row")
      .first()
      .find("datatable-body-cell")
      .first()
      .then(($cell) => {
        const IP = $cell.text();
        cy.get('input[placeholder="Type to filter sessions"]').clear().type(IP);
        cy.get("datatable-body-row").its("length").should("be.gte", 1);
      });

    // Filter by location (only Unknown sessions should be included here)
    cy.get('input[placeholder="Type to filter sessions"]')
      .clear()
      .type("Unknown");
    cy.get("datatable-body-row").its("length").should("be.gte", 1);

    // This is the same as in admin_sessions.spec
    cy.get("datatable-body-row").first().find(".fa-clipboard").click();
    // cy.checkalert("Token successfully copied");

    // Verify the clipboard requires an additional plugin...
  });

  // This is the same as in admin_sessions.spec
  it("Delete", () => {
    cy.get("span.datatable-header-cell-label").contains("Expiration").click();

    cy.get("datatable-body-row").then((rows) => {
      const num = Cypress.$(rows).length;

      // Get the second-last token
      cy.wrap(rows)
        .eq(length - 2)
        .find(".fa-trash")
        .click();
      cy.get("h3.popover-title").contains("Confirmation required");
      cy.get("button").contains("Cancel").click();
      cy.get("h3.popover-title")
        .contains("Confirmation required")
        .should("not.exist");

      // Delete the second-last token
      cy.wrap(rows)
        .eq(length - 2)
        .find(".fa-trash")
        .click();
      cy.get("h3.popover-title").contains("Confirmation required");
      cy.get("button").contains("Confirm").click();

      cy.checkalert("Confirmation: token successfully deleted");
    });
  });
});
