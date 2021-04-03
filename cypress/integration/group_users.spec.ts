// This is to silence ESLint about undefined cy
/*global cy, Cypress*/
import { getpassword, get_random_username } from "../../fixtures/utilities";

describe("GroupUsers", () => {
  it("Test Group Users", () => {
    const email = get_random_username("coordinator");
    const pwd = getpassword(4);
    // ....................., expired, init, roles
    cy.createuser(email, pwd, false, true, ["coordinator", "user"]);
    cy.login(email, pwd);

    cy.visit("/app/group/users");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/group/users");
    });

    cy.goto_profile();

    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/group/users");
    });

    cy.get("navbar").find("a:contains('My Group')").click({ force: true });

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/group/users");
    });

    cy.get("div.card-header h1").contains("Users in group ");

    cy.get("i.fa-sync-alt").click({ force: true });

    cy.get('input[placeholder="Type to filter users"]').as("search");

    cy.get("datatable-body-row").its("length").should("be.gt", 1);

    cy.get("@search").clear().type("thisisinvalidforsure");
    cy.get("datatable-body-row").should("have.length", 0);
    cy.get("@search").clear().type(email);
    cy.get("datatable-body-row").should("have.length", 1);
    cy.get("@search").clear();
  });
});
