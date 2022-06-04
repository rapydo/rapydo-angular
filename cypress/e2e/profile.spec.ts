// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Profile", () => {
  it("Profile - with authentication", () => {
    cy.login();

    cy.visit("/app/profile");

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.get("div.card-header h1").contains("Your profile");

    cy.get("table").find("th").contains("Full Name");
    cy.get("table").find("th").contains("Email");
    cy.get("table").find("th").contains("Group");
    cy.get("table").find("th").contains("Roles");
    cy.get("table").find("th").contains("Privacy Accepted");
    cy.get("table").find("th").contains("Last password change");
    cy.get("table").find("th").contains("Open Sessions");

    cy.get("table").find("td").contains(Cypress.env("AUTH_DEFAULT_USERNAME"));

    cy.get("div.card-header h1")
      .find(".fa-pen-to-square")
      .click({ force: true });
    cy.get("div.modal-header h1.modal-title").contains("Update your profile");
    cy.get('button:contains("Close")').click({ force: true });

    const randval = Math.floor(Math.random() * 1000000);
    cy.get("div.card-header h1")
      .find(".fa-pen-to-square")
      .click({ force: true });
    cy.get("div.modal-header h1.modal-title").contains("Update your profile");

    cy.get('input[placeholder="First Name"]')
      .clear()
      .type("NewName" + randval);
    cy.get('input[placeholder="Last Name"]')
      .clear()
      .type("NewSurname" + randval);
    cy.get('button:contains("Submit")').click({ force: true });
    cy.get("table")
      .find("td")
      .contains("NewName" + randval);
    cy.get("table")
      .find("td")
      .contains("NewSurname" + randval);
  });
});
