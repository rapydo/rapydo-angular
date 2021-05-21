// This is to silence ESLint about undefined cy
/*global cy, Cypress*/
import { getpassword, get_random_username } from "../../fixtures/utilities";

describe("AdminLogins", () => {
  const random_username = get_random_username("random");

  beforeEach(() => {
    // Create a failed login entry
    const pwd = getpassword(4);

    cy.visit("/app/login");

    cy.get("input[placeholder='Your username (email)']")
      .clear()
      .type(random_username);
    cy.get("input[placeholder='Your password']").clear().type(pwd);
    cy.get("button").contains("Login").click();
    cy.checkalert("Invalid access credentials");

    cy.login();

    cy.visit("/app/admin/logins");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/logins");
    });
  });

  it("View Logins", () => {
    cy.get("div.card-header h1").contains("Logins");

    cy.get('input[placeholder="Type to filter logins"]').as("search");

    cy.get("datatable-body-row").its("length").should("be.gt", 1);

    cy.get("@search").clear().type("thisisinvalidforsure");
    cy.get("datatable-body-row").should("have.length", 0);

    // search by username
    cy.get("@search").clear().type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("datatable-body-row").its("length").should("be.gte", 1);
    cy.get("datatable-body-row")
      .eq(0)
      .contains(Cypress.env("AUTH_DEFAULT_USERNAME"));

    // search the failed login
    cy.get("@search").clear().type(random_username);
    cy.get("datatable-body-row").should("have.length", 1);
    cy.get("datatable-body-row").eq(0).contains(random_username);
    cy.get("datatable-body-row").eq(0).find(".fa-times");
  });
});
