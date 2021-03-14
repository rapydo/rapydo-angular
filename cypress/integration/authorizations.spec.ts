// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminUsers", () => {
  const admin_email = "admin" + Math.random() + "@sample.org";
  const staff_email = "staff" + Math.random() + "@sample.org";
  const coordinator_email = "coordinator" + Math.random() + "@sample.org";
  const user_email = "user" + Math.random() + "@sample.org";

  const pwd = getpassword(4);

  before(() => {
    cy.createuser(admin_email, pwd);
    cy.createuser(staff_email, pwd);
    cy.createuser(coordinator_email, pwd);
    cy.createuser(user_email, pwd);

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

    // Set the staff user
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type(staff_email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    // set the roles...
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Set the coordinator user
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type(coordinator_email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    // set the roles...
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Set the normal user
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type(user_email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    // set the roles...
    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");
  });

  it("Test Admin authorizations", () => {
    cy.login(admin_email, pwd);

    cy.logout();
  });

  it("Test Staff authorizations", () => {
    cy.login(staff_email, pwd);

    cy.logout();
  });

  it("Test Coordinator authorizations", () => {
    cy.login(coordinator_email, pwd);

    cy.logout();
  });

  it("Test User authorizations", () => {
    cy.login(user_email, pwd);

    cy.logout();
  });

  it("Test Public authorizations", () => {});

  after(() => {
    cy.login();
    cy.deleteuser(admin_email);
    cy.deleteuser(staff_email);
    cy.deleteuser(coordinator_email);
    cy.deleteuser(user_email);
  });
});
