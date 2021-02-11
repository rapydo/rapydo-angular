// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword } from "../../fixtures/utilities";

describe("AccountExpired", () => {
  it("LOGIN EXPIRED", () => {
    const email = "aaaaaaaaaa000444" + Math.random() + "@sample.org";
    const pwd = getpassword(4);

    cy.createuser(email, pwd, true);

    cy.visit("/app/login");

    cy.get("input[placeholder='Your username (email)']").as("user");
    cy.get("input[placeholder='Your password']").as("pwd");

    cy.get("@user").type(email);
    cy.get("@pwd").type(pwd);
    cy.get("button").contains("Login").click();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/login");
    });

    cy.checkalert("Sorry, this account is expired");

    cy.visit("/public/reset");
    cy.get("div.card-header h4").contains("Reset your password");

    cy.intercept("POST", "/auth/reset").as("reset");

    cy.get(
      'input[placeholder="Type here your email address to receive the reset link"]'
    )
      .clear()
      .type(email);
    cy.get("button:contains('Submit request')").click();

    cy.wait("@reset");

    cy.checkalert("Sorry, this account is expired");

    cy.login();

    // Verify the admin page to check the validity icon
    cy.visit("/app/admin/users");

    cy.get('input[placeholder="Type to filter users"]').as("search");
    cy.get("@search").clear().type(email);

    cy.get("datatable-body-row").first().contains("datatable-body-cell", email);

    // The user is already expired
    cy.get("datatable-body-row")
      .first()
      .find(".fa-hourglass-end")
      .should("have.class", "red");

    // Edit the user
    cy.get("datatable-body-row")
      .first()
      .find(".fa-edit")
      .click({ force: true });
    // Open the datepicker
    cy.get(
      'input[placeholder="This user will be blocked after this date"]'
    ).click();

    // Select the 31 - 12 - 2050 (the max allowed)
    cy.get(
      'ngb-datepicker-navigation-select select[title="Select year"]'
    ).select("2050");
    cy.get(
      'ngb-datepicker-navigation-select select[title="Select month"]'
    ).select("12");
    cy.get("div.ngb-dp-day div").contains("31").click({ force: true });
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Verify the new expirationd date
    cy.get("@search").clear().type(email);

    cy.get("datatable-body-row").first().contains("datatable-body-cell", email);

    // The user is no longer expired
    cy.get("datatable-body-row")
      .first()
      .find(".fa-hourglass-start")
      .should("have.class", "orange");

    // Let's remove the expiration date
    cy.get("datatable-body-row")
      .first()
      .find(".fa-edit")
      .click({ force: true });
    // Open the datepicker
    cy.get('input[placeholder="This user will be blocked after this date"]')
      .parent()
      .find(".fa-times")
      .click({ force: true });
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Let's verify the user
    cy.get("@search").clear().type(email);

    cy.get("datatable-body-row").first().contains("datatable-body-cell", email);

    // The user is no longer expired
    cy.get("datatable-body-row")
      .first()
      .find(".fa-check")
      .should("have.class", "green");

    // Ok, that's all... bye bye
    cy.deleteuser(email);
  });
});
