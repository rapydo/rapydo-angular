// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

/* mostly copied From AdminUsers */
import { getpassword, get_random_username } from "../../fixtures/utilities";

if (Cypress.env("AUTH_ROLES").includes(",staff_user,")) {
  describe("StaffUsers", () => {
    // do not directly create the random values here,
    // otherwise will be always the same on each test repetition!
    // do not generate it in the before() block, or will be not re-created on repetitions
    let username;
    let staff_email;
    let staff_pwd;

    before(() => {
      staff_email = get_random_username("staff");
      staff_pwd = getpassword(4);
      // ................................., expired, init, roles
      cy.createuser(staff_email, staff_pwd, false, true, ["staff", "user"]);
    });

    beforeEach(() => {
      cy.login(staff_email, staff_pwd);

      cy.visit("/app/admin/users");

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/admin/users");
      });
    });

    it("Create new user", () => {
      // with this prefix on the email the user should be the first when sorted by email
      username = get_random_username("a000000000000");

      cy.get('button:contains("new user")').click({ force: true });
      cy.get('button:contains("Close")').click({ force: true });

      cy.get('button:contains("new user")').click({ force: true });

      cy.get('input[placeholder="Email"]').as("email");
      cy.get('input[placeholder="Password"]').as("password");
      cy.get('input[placeholder="First Name"]').as("name");
      cy.get('input[placeholder="Last Name"]').as("surname");
      cy.get('button:contains("Submit")').as("submit");

      cy.get("@submit").click({ force: true });
      cy.checkvalidation(0, "This field is required");
      cy.checkvalidation(1, "This field is required");
      cy.checkvalidation(2, "This field is required");
      cy.checkvalidation(3, "This field is required");

      cy.get("@email").clear().type("invalid");
      cy.get("@submit").click({ force: true });
      cy.checkvalidation(0, "Invalid email address");
      cy.checkvalidation(1, "This field is required");
      cy.checkvalidation(2, "This field is required");
      cy.checkvalidation(3, "This field is required");

      cy.get("@email").clear().type(staff_email);
      cy.get("@password").clear().type("short");
      cy.get("@submit").click({ force: true });
      cy.checkvalidation(0, "This field is required");
      cy.checkvalidation(1, "This field is required");
      cy.checkvalidation(
        2,
        "Should have at least " +
          Cypress.env("AUTH_MIN_PASSWORD_LENGTH") +
          " characters"
      );

      cy.get("@password").clear().type(getpassword(4));
      cy.get("@name").clear().type("SampleName");
      cy.get("@surname").clear().type("SampleSurname");

      // get custom fields added at project level:
      // foreach element select required input text/number still empty and fill them
      cy.get("input").each(($el, index, $list) => {
        if ($el.prop("required") && $el.val() === "") {
          if ($el.attr("type") === "text") {
            cy.wrap($el).type("a");
          } else if ($el.attr("type") === "number") {
            cy.wrap($el).type("1");
          }
        }
      });

      // Pick all the selects, included Groups and any other custom fields (like in IMC)
      cy.get("form")
        .find("ng-select")
        .each(($el, index, $list) => {
          cy.wrap($el).find("input").click({ force: true });
          cy.wrap($el).find("div.ng-option").eq(1).click({ force: true });
        });

      cy.get("formly-validation-message").should("not.exist");

      cy.get("@submit").click({ force: true });

      cy.checkalert("A User already exists with email: " + staff_email);

      cy.get("@email").clear().type(username);
      cy.get("@submit").click({ force: true });

      cy.checkalert("Confirmation: user successfully created");

      cy.get("datatable-body").contains("datatable-body-cell", username);
      // The user is created without roles, but User is added by default
      cy.get("datatable-body").contains("datatable-body-cell", "User");
    });

    it("Search and sort user", () => {
      cy.get('input[placeholder="Type to filter users"]').as("search");

      cy.get("datatable-body-row").its("length").should("be.gt", 1);

      // search by email
      cy.get("@search").clear().type("thisisinvalidforsure");
      cy.get("datatable-body-row").should("have.length", 0);
      cy.get("@search").clear().type(staff_email);
      cy.get("datatable-body-row").should("have.length", 1);
      cy.get("@search").clear().type(username);
      cy.get("datatable-body-row").should("have.length", 1);

      // search by name
      cy.get("@search").clear().type("SampleName");
      cy.get("datatable-body-row").should("have.length", 1);

      // search by surname
      cy.get("@search").clear().type("SampleSurname");
      cy.get("datatable-body-row").should("have.length", 1);

      cy.get("@search").clear();

      // Sort by email, username is now the first
      cy.get("span.datatable-header-cell-label")
        .contains("Email")
        .click({ force: true });

      cy.get("datatable-body-row")
        .first()
        .contains("datatable-body-cell", username);
      cy.get("datatable-body-row")
        .last()
        .contains("datatable-body-cell", username)
        .should("not.exist");

      // Sort by email again, username is now the last
      cy.get("span.datatable-header-cell-label")
        .contains("Email")
        .click({ force: true });
      cy.get("datatable-body-row")
        .first()
        .contains("datatable-body-cell", username)
        .should("not.exist");

      cy.get("datatable-body-row")
        .last()
        .contains("datatable-body-cell", username);
    });

    it("Modify user", () => {
      cy.get('input[placeholder="Type to filter users"]').as("search");

      cy.get("@search").clear().type(username);
      cy.get("datatable-body-row")
        .eq(0)
        .contains("datatable-body-cell", username);

      cy.get("datatable-body-row")
        .eq(0)
        .find(".fa-edit")
        .click({ force: true });
      cy.get('button:contains("Close")').click({ force: true });

      cy.get("datatable-body-row")
        .eq(0)
        .contains("datatable-body-cell", "SampleName");

      cy.get("datatable-body-row")
        .eq(0)
        .find(".fa-edit")
        .click({ force: true });
      cy.get('input[placeholder="Email"]').should("not.exist");
      cy.get('input[placeholder="First Name"]').clear().type("NewName");
      // cy.get('input:checkbox[value="normal_user"]').uncheck({ force: true });
      cy.get("ng-select")
        .find("span.ng-value-icon")
        .eq(0)
        .click({ force: true });

      cy.get('button:contains("Submit")').click({ force: true });
      cy.checkalert("Confirmation: user successfully updated");

      cy.get("@search").clear().type(username);
      cy.get("datatable-body-row")
        .eq(0)
        .contains("datatable-body-cell", "NewName");
      // The role is still there... because it is the default
      // This can't work because "User" label can be changed at project level
      // cy.get("datatable-body-row").eq(0).contains("datatable-body-cell", "User");

      // Restore previous value
      cy.get("datatable-body-row")
        .eq(0)
        .find(".fa-edit")
        .click({ force: true });
      cy.get('input[placeholder="First Name"]').clear().type("SampleName");
      cy.get('button:contains("Submit")').click({ force: true });
      cy.checkalert("Confirmation: user successfully updated");
    });

    it("Delete user", () => {
      cy.get('input[placeholder="Type to filter users"]').as("search");

      cy.get("@search").clear().type(username);
      cy.get("datatable-body-row")
        .eq(0)
        .contains("datatable-body-cell", username);
      cy.get("datatable-body-row")
        .eq(0)
        .find(".fa-trash")
        .click({ force: true });
      cy.get("h2.modal-title").contains("Confirmation required");
      cy.get("button").contains("No, cancel").click({ force: true });
      cy.get("datatable-body-row")
        .eq(0)
        .contains("datatable-body-cell", username);
      cy.get("datatable-body-row")
        .eq(0)
        .find(".fa-trash")
        .click({ force: true });
      cy.get("h2.modal-title").contains("Confirmation required");
      cy.get("button").contains("Yes, delete").click({ force: true });

      cy.checkalert("Confirmation: user successfully deleted");

      cy.get("@search").clear().type(username);

      cy.get("datatable-body-row").should("not.exist");

      cy.get('input[placeholder="Type to filter users"]').clear();

      cy.get("datatable-body-row").its("length").should("be.gte", 1);
    });

    it("Staff restrictions", () => {
      // Admin role is not shown on create
      cy.get('button:contains("new user")').click({ force: true });

      // open the options
      cy.get("ng-select").eq(0).find("input").click({ force: true });
      cy.get("ng-dropdown-panel").find("div.ng-option span").contains("User");
      cy.get("ng-dropdown-panel")
        .find("div.ng-option span")
        .contains("Admin")
        .should("not.exist");
      cy.get('button:contains("Close")').click({ force: true });

      // Admin role is not shown on edit
      cy.get("datatable-body-row")
        .eq(0)
        .find(".fa-edit")
        .click({ force: true });
      // open the options
      cy.get("ng-select").eq(0).find("input").click({ force: true });
      cy.get("ng-dropdown-panel")
        .find("div.ng-option span")
        .contains("Admin")
        .should("not.exist");
      cy.get('button:contains("Close")').click({ force: true });

      // Admins are not shown in the list
      cy.get('input[placeholder="Type to filter users"]')
        .clear()
        .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
      cy.get("datatable-body-row").should("not.exist");
    });
  });
}
