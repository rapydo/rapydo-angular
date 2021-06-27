// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminSessions", () => {
  beforeEach(() => {
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
    // Already sorted by Expiration, current token is the last
    // Sort by Expiration, current token is now the first
    // cy.get("span.datatable-header-cell-label").contains("Expiration").click();
    // cy.get("datatable-body-row").first().find(".fa-trash").should("not.exist");

    cy.get('input[placeholder="Type to filter sessions"]').as("filter");

    cy.get("datatable-body-row").its("length").should("be.gte", 1);

    cy.get("@filter").clear();
    // Not probable to have five consective Ws
    cy.get("@filter").type("WWWWW");
    // debounceTime is set to 200
    cy.wait(250);

    cy.get("datatable-body-row").should("have.length", 0);

    // Filter by username
    cy.get("@filter").clear();

    for (let x of Cypress.env("AUTH_DEFAULT_USERNAME")) {
      cy.get("@filter").type(x);
    }
    cy.wait(200);

    cy.get("datatable-body-row").its("length").should("be.gte", 1);

    // Filter by location (only Unknown sessions should be included here)
    cy.get("@filter").clear();

    cy.get("@filter").type("U");
    cy.get("@filter").type("n");
    cy.get("@filter").type("k");
    cy.get("@filter").type("n");
    cy.get("@filter").type("o");
    cy.get("@filter").type("w");
    cy.get("@filter").type("n");
    cy.wait(200);

    cy.get("datatable-body-row").its("length").should("be.gte", 1);

    // Filter by IP
    cy.get("datatable-body-row")
      .first()
      .find("datatable-body-cell")
      .eq(1)
      .then(($cell) => {
        const IP = $cell.text();

        cy.get("@filter").clear();
        for (let x of IP) {
          cy.get("@filter").type(x);
        }
        cy.wait(200);

        cy.get("datatable-body-row").its("length").should("be.gte", 1);
      });

    // This is the same as in profile.sessions.spec
    cy.get("datatable-body-row").first().find(".fa-clipboard").click();
    // cy.checkalert("Token successfully copied");

    // Clipboard verification requires an additional plugin...
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
