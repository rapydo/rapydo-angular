// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminSessions", () => {
  beforeEach(() => {
    // A lot's of logins... to have some tokens to test with
    // for (let i = 0; i < 21; i++) {
    //   cy.login();
    // }

    cy.login();

    cy.visit("/app/admin/sessions");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/sessions");
    });
  });

  // This is the same as in profile.sessions.spec
  it("Sort, search, copy", () => {
    cy.scrollTo("bottom");
    cy.get("div.page-count").contains(" total");
    cy.get("ul.pager").find("li.pages:contains(' 1 ')");
    cy.get("ul.pager").find("li.pages:contains(' 2 ')").click();
    cy.get("ul.pager").find("li.pages:contains(' 1 ')").click();
    cy.scrollTo("top");

    cy.get("span.datatable-header-cell-label").contains("Expiration").click();
    cy.get("datatable-body-row").first().find(".fa-trash");

    // this does not work because server side sort is not implemented:
    // Already sorted by Expiration, curent token is lhe last
    // Sort by Expiration, current token is now the first
    // cy.get("span.datatable-header-cell-label").contains("Expiration").click();
    // cy.get("datatable-body-row").first().find(".fa-trash").should("not.exist");

    cy.get("datatable-body-row").its("length").should("be.gte", 1);
    cy.get('input[placeholder="Type to filter sessions"]')
      .clear()
      .type("thisisinvalidforsure");
    cy.get("datatable-body-row").should("have.length", 0);

    // Filter by username
    cy.get('input[placeholder="Type to filter sessions"]')
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("datatable-body-row").its("length").should("be.gte", 1);

    // Filter by location (only Unknown sessions should be included here)
    cy.get('input[placeholder="Type to filter sessions"]')
      .clear()
      .type("Unknown");
    cy.get("datatable-body-row").its("length").should("be.gte", 1);

    // Filter by IP
    cy.get("datatable-body-row")
      .first()
      .find("datatable-body-cell")
      .eq(1)
      .then(($cell) => {
        const IP = $cell.text();
        cy.get('input[placeholder="Type to filter sessions"]').clear().type(IP);
        cy.get("datatable-body-row").its("length").should("be.gte", 1);
      });

    // This is the same as in profile.sessions.spec
    cy.get("datatable-body-row").first().find(".fa-clipboard").click();
    // cy.checkalert("Token successfully copied");

    // Verify the clipboard requires an additional plugin...
  });

  // This is the same as in profile.sessions.spec
  it("Delete", () => {
    cy.get("span.datatable-header-cell-label").contains("Expiration").click();
    // due to scroll not work we cannot visualize firt and last tokens...
    // let's click in the middle...
    cy.get("datatable-body-row").eq(15).find(".fa-trash").click();
    cy.get("h2.modal-title").contains("Confirmation required");
    cy.get("button").contains("No, cancel").click();
    cy.get("datatable-body-row").eq(15).find(".fa-trash").click();
    cy.get("h2.modal-title").contains("Confirmation required");
    cy.get("button").contains("Yes, delete").click();

    cy.checkalert("Confirmation: token successfully deleted");
  });

  it("Backend errors", () => {
    cy.intercept("GET", /\/api\/admin\/tokens\?*/, {
      statusCode: 500,
      body: "Stubbed get error",
    }).as("get");

    cy.visit("/app/admin/sessions");
    cy.wait("@get");
    cy.checkalert("Stubbed get error");
  });
});
