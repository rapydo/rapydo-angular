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
    const email = admin_email;
    cy.createuser(email, pwd);
    cy.login();
    cy.visit("/app/admin/users");

    // Set the admin user
    cy.get('input[placeholder="Type to filter users"]').clear().type(email);

    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });
    // remove all previous roles...
    cy.get("ng-select")
      .eq(0)
      .find("span.ng-value-icon")
      .each(($el, index, $list) => {
        cy.wrap($el).click({ force: true });
      });
    // and set the new role...
    cy.get("ng-select").eq(0).find("input").type("admin");
    cy.get("ng-dropdown-panel")
      .find("div.ng-option")
      .eq(0)
      .click({ force: true });

    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Test authorizations
    cy.login(email, pwd);

    cy.goto_profile();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.visit("/app/profile/changepassword");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });
    cy.visit("/app/profile/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });
    cy.visit("/app/admin/users");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/users");
    });
    cy.visit("/app/admin/groups");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/groups");
    });
    cy.visit("/app/admin/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/sessions");
    });
    cy.visit("/app/admin/stats");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/stats");
    });

    // Delete temporary user
    cy.logout();
    cy.login();
    cy.deleteuser(email);
  });

  it("Test Staff authorizations", () => {
    const email = staff_email;
    cy.createuser(email, pwd);
    cy.login();
    cy.visit("/app/admin/users");

    // Set the staff user
    cy.get('input[placeholder="Type to filter users"]').clear().type(email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });

    // remove all previous roles...
    cy.get("ng-select")
      .eq(0)
      .find("span.ng-value-icon")
      .each(($el, index, $list) => {
        cy.wrap($el).click({ force: true });
      });
    // and set the new role...
    cy.get("ng-select").eq(0).find("input").type("staff");
    cy.get("ng-dropdown-panel")
      .find("div.ng-option")
      .eq(0)
      .click({ force: true });

    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Test authorizations
    cy.login(email, pwd);

    cy.goto_profile();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.visit("/app/profile/changepassword");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });
    cy.visit("/app/profile/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });
    cy.visit("/app/admin/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/users");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);

    cy.visit("/app/admin/groups");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/groups");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);

    cy.visit("/app/admin/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/sessions");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);

    cy.visit("/app/admin/stats");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/stats");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);

    // Delete temporary user
    cy.logout();
    cy.login();
    cy.deleteuser(email);
  });

  it("Test Coordinator authorizations", () => {
    const email = coordinator_email;
    cy.createuser(email, pwd);
    cy.login();
    cy.visit("/app/admin/users");

    // Set the coordinator user
    cy.get('input[placeholder="Type to filter users"]').clear().type(email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });

    // remove all previous roles...
    cy.get("ng-select")
      .eq(0)
      .find("span.ng-value-icon")
      .each(($el, index, $list) => {
        cy.wrap($el).click({ force: true });
      });
    // and set the new role...
    cy.get("ng-select").eq(0).find("input").type("coordinator");
    cy.get("ng-dropdown-panel")
      .find("div.ng-option")
      .eq(0)
      .click({ force: true });

    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Test authorizations
    cy.login(email, pwd);

    cy.goto_profile();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.visit("/app/profile/changepassword");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });
    cy.visit("/app/profile/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });
    cy.visit("/app/admin/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/users");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);

    cy.visit("/app/admin/groups");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/groups");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);

    cy.visit("/app/admin/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/sessions");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);

    cy.visit("/app/admin/stats");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/stats");
    });
    cy.checkalert(
      "Permission denied: you are not authorized to access this page"
    );
    cy.login(email, pwd);

    // Delete temporary user
    cy.logout();
    cy.login();
    cy.deleteuser(email);
  });

  it("Test User authorizations", () => {
    const email = user_email;
    cy.createuser(email, pwd);
    cy.login();
    cy.visit("/app/admin/users");

    // Set the normal user
    cy.get('input[placeholder="Type to filter users"]').clear().type(email);
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click({ force: true });

    // remove all previous roles...
    cy.get("ng-select")
      .eq(0)
      .find("span.ng-value-icon")
      .each(($el, index, $list) => {
        cy.wrap($el).click({ force: true });
      });
    // and set the new role...
    cy.get("ng-select").eq(0).find("input").type("user");
    cy.get("ng-dropdown-panel")
      .find("div.ng-option")
      .eq(0)
      .click({ force: true });

    cy.get('button:contains("Submit")').click({ force: true });
    cy.checkalert("Confirmation: user successfully updated");

    // Test authorizations
    cy.login(email, pwd);

    cy.goto_profile();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile");
    });

    cy.visit("/app/profile/changepassword");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/changepassword");
    });
    cy.visit("/app/profile/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/profile/sessions");
    });
    cy.visit("/app/admin/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/users");
    });
    cy.visit("/app/admin/groups");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/groups");
    });
    cy.visit("/app/admin/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/sessions");
    });
    cy.visit("/app/admin/stats");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/stats");
    });

    // Delete temporary user
    cy.logout();
    cy.login();
    cy.deleteuser(email);
  });

  it("Test Public authorizations", () => {
    cy.visit("/app/profile");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/profile");
    });
    cy.visit("/app/profile/changepassword");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/profile/changepassword");
    });
    cy.visit("/app/profile/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/profile/sessions");
    });
    cy.visit("/app/admin/users");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/users");
    });
    cy.visit("/app/admin/groups");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/groups");
    });
    cy.visit("/app/admin/sessions");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/sessions");
    });
    cy.visit("/app/admin/stats");
    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/admin/stats");
    });
  });
});
