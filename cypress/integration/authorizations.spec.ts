// This is to silence ESLint about undefined cy
/*global cy, Cypress*/
import { getpassword } from "../../fixtures/utilities";

describe("AdminUsers", () => {
  const admin_email = "admin" + Math.random() + "@sample.org";
  const staff_email = "staff" + Math.random() + "@sample.org";
  const coordinator_email = "coordinator" + Math.random() + "@sample.org";
  const user_email = "user" + Math.random() + "@sample.org";

  const pwd = getpassword(4);

  it("Test Admin authorizations", () => {
    cy.createuser(admin_email, pwd);
    cy.login();
    cy.visit("/app/admin/users");

    // Set the admin user
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type(admin_email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    // set the roles...
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Test authorizations
    cy.login(admin_email, pwd);

    // Delete temporary user
    cy.logout();
    cy.deleteuser(admin_email);
  });

  it("Test Staff authorizations", () => {
    cy.createuser(staff_email, pwd);
    cy.login();
    cy.visit("/app/admin/users");

    // Set the staff user
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type(staff_email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    // set the roles...
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Test authorizations
    cy.login(staff_email, pwd);

    // Delete temporary user
    cy.logout();
    cy.deleteuser(staff_email);
  });

  it("Test Coordinator authorizations", () => {
    cy.createuser(coordinator_email, pwd);
    cy.login();
    cy.visit("/app/admin/users");

    // Set the coordinator user
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type(coordinator_email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    // set the roles...
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Test authorizations
    cy.login(coordinator_email, pwd);

    // Delete temporary user
    cy.logout();
    cy.deleteuser(coordinator_email);
  });

  it("Test User authorizations", () => {
    cy.createuser(user_email, pwd);
    cy.login();
    cy.visit("/app/admin/users");

    // Set the normal user
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type(user_email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    // set the roles...
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Test authorizations
    cy.login(user_email, pwd);

    // Delete temporary user
    cy.logout();
    cy.deleteuser(user_email);
  });

  it("Test Public authorizations", () => {});
});
