// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminUsers", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/app/admin/groups");

    cy.closecookielaw();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/groups");
    });
  });

  it("Create new group", () => {
    const randval = Math.floor(Math.random() * 1000000);

    cy.get('button:contains("new group")').click({ force: true });
    cy.get('button:contains("Close")').click({ force: true });

    cy.get('button:contains("new group")').click({ force: true });

    cy.get('input[placeholder="Short name"]').as("short");
    cy.get('input[placeholder="Full name"]').as("full");
    cy.get('button:contains("Submit")').as("submit");

    cy.get("@submit").click({ force: true });
    cy.checkvalidation(0, "This field is required");
    cy.checkvalidation(1, "This field is required");

    cy.get("@short")
      .clear()
      .type("_TestGroup-" + randval);
    cy.get("@full")
      .clear()
      .type("Long name for test Group " + randval);

    cy.get("formly-validation-message").should("not.exist");

    cy.get("@submit").click({ force: true });

    cy.checkalert("Confirmation: group successfully created");

    cy.get('input[placeholder="Type to filter groups"]')
      .clear()
      .type("_TestGroup-" + randval);

    cy.get("datatable-body").contains(
      "datatable-body-cell",
      "_TestGroup-" + randval
    );

    // Test duplications
    cy.get('button:contains("new group")').click({ force: true });
    cy.get('input[placeholder="Short name"]').type("_TestGroup-" + randval);
    cy.get('input[placeholder="Full name"]').type(
      "Long name for test Group " + randval
    );

    cy.get("@submit").click({ force: true });

    cy.checkalert(
      "A Group already exists with shortname: _TestGroup-" + randval
    );

    cy.get('button:contains("Close")').click({ force: true });
  });

  it("Search and sort group", () => {
    cy.get('input[placeholder="Type to filter groups"]').as("search");

    cy.get("datatable-body-row").its("length").should("be.gt", 1);

    cy.get("@search").clear().type("thisisinvalidforsure");
    cy.get("datatable-body-row").should("have.length", 0);
    // search by shortname
    cy.get("@search").clear().type("_TestGroup");
    cy.get("datatable-body-row").should("have.length", 1);
    // search by fullname
    cy.get("@search").clear().type("Long name for ");
    cy.get("datatable-body-row").should("have.length", 1);

    cy.get("@search").clear();

    // Sort by shortname, _TestGroup is now the first
    cy.get("span.datatable-header-cell-label")
      .contains("Shortname")
      .click({ force: true });

    cy.get("datatable-body-row")
      .first()
      .contains("datatable-body-cell", "_TestGroup");

    // Sort by shortname again, _TestGroup is no longer the first
    cy.get("span.datatable-header-cell-label")
      .contains("Shortname")
      .click({ force: true });
    cy.get("datatable-body-row")
      .first()
      .contains("datatable-body-cell", "_TestGroup")
      .should("not.exist");
  });

  it("Modify group", () => {
    const randval = Math.floor(Math.random() * 1000000);

    cy.get('input[placeholder="Type to filter groups"]').as("search");

    cy.get("@search").clear().type("_TestGroup");
    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", "_TestGroup");

    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    cy.get('button:contains("Close")').click({ force: true });

    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", "_TestGroup");

    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    cy.get('input[placeholder="Short name"]')
      .clear()
      .type("NewName-" + randval);
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: group successfully update");

    // search by fulname and verify the new short name
    cy.get("@search").clear().type("Long name for test Group");
    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", "NewName-" + randval);
  });

  it("Delete group", () => {
    cy.get('input[placeholder="Type to filter groups"]').as("search");
    cy.get("@search").clear().type("NewName");
    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", "NewName");
    cy.get("datatable-body-row").eq(0).find(".fa-trash").click({ force: true });
    cy.get("h5.modal-title").contains("Confirmation required");
    cy.get("button").contains("No, cancel").click({ force: true });
    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", "NewName");
    cy.get("datatable-body-row").eq(0).find(".fa-trash").click({ force: true });
    cy.get("h5.modal-title").contains("Confirmation required");
    cy.get("button").contains("Yes, delete").click({ force: true });

    cy.checkalert("Confirmation: group successfully deleted");

    cy.get("@search").clear().type("NewName");

    cy.get("datatable-body-row").should("not.exist");

    cy.get("@search").clear();

    cy.get("datatable-body-row").its("length").should("be.gte", 1);
  });

  it("Backend errors", () => {
    cy.intercept("DELETE", /\/api\/admin\/groups\/*/, {
      statusCode: 500,
      body: "Stubbed delete error",
    }).as("delete");

    cy.get("datatable-body-row").eq(0).find(".fa-trash").click({ force: true });
    cy.get("button").contains("Yes, delete").click({ force: true });

    cy.wait("@delete");
    cy.checkalert("Stubbed delete error");

    cy.intercept("GET", "/api/admin/groups", {
      statusCode: 500,
      body: "Stubbed get error",
    }).as("get");

    cy.visit("/app/admin/groups");
    cy.wait("@get");
    cy.checkalert("Stubbed get error");
  });
});
