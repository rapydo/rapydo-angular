// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("AdminUsers", () => {
  beforeEach(() => {
    cy.login();

    cy.visit("/app/admin/users");

    cy.closecookielaw();

    cy.location().should((location) => {
      expect(location.pathname).to.eq("/app/admin/users");
    });
  });

  it("Create new user", () => {
    // with this email the user should be the first when sorted by email
    const username = "aaa0000000000000@sample.org";

    cy.get('button:contains("new user")').click();
    cy.get('button:contains("Close")').click({ force: true });

    cy.get('button:contains("new user")').click();

    cy.get('input[placeholder="Email"]').as("email");
    cy.get('input[placeholder="Password"]').as("password");
    cy.get('input[placeholder="Name"]').as("name");
    cy.get('input[placeholder="Surname"]').as("surname");
    cy.get('button:contains("Submit")').as("submit");

    cy.get("@submit").click({ force: true });
    cy.get("formly-validation-message")
      .eq(0)
      .contains("This field is required");
    cy.get("formly-validation-message")
      .eq(1)
      .contains("This field is required");
    cy.get("formly-validation-message")
      .eq(2)
      .contains("This field is required");
    cy.get("formly-validation-message")
      .eq(3)
      .contains("This field is required");

    cy.get("@email").clear().type("invalid");
    cy.get("@submit").click({ force: true });
    cy.get("formly-validation-message").eq(0).contains("Invalid email address");
    cy.get("formly-validation-message")
      .eq(1)
      .contains("This field is required");
    cy.get("formly-validation-message")
      .eq(2)
      .contains("This field is required");
    cy.get("formly-validation-message")
      .eq(3)
      .contains("This field is required");

    cy.get("@email").clear().type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("@password").clear().type("short");
    cy.get("@submit").click({ force: true });
    cy.get("formly-validation-message")
      .eq(0)
      .contains("Should have at least 8 characters");
    cy.get("formly-validation-message")
      .eq(1)
      .contains("This field is required");
    cy.get("formly-validation-message")
      .eq(2)
      .contains("This field is required");

    cy.get("@password").clear().type("looooong");
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

    cy.get("formly-validation-message").should("not.exist");

    cy.get("@submit").click({ force: true });

    cy.get("div[role=alertdialog]")
      .contains(
        "Email already exists with value: " +
          Cypress.env("AUTH_DEFAULT_USERNAME")
      )
      .click({ force: true });
    cy.get("@email").clear().type(username);
    cy.get("@submit").click({ force: true });

    cy.get("div[role=alertdialog]")
      .contains("Confirmation: user successfully created")
      .click({ force: true });

    cy.get("datatable-body").contains("datatable-body-cell", username);
  });

  it("Search and sort user", () => {
    const username = "aaa0000000000000@sample.org";

    cy.get("datatable-body-row").its("length").should("be.gt", 1);

    // search by email
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type("thisisinvalidforsure");
    cy.get("datatable-body-row").should("have.length", 0);
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type(Cypress.env("AUTH_DEFAULT_USERNAME"));
    cy.get("datatable-body-row").should("have.length", 1);
    cy.get('input[placeholder="Type to filter users"]').clear().type(username);
    cy.get("datatable-body-row").should("have.length", 1);

    // search by name
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type("SampleName");
    cy.get("datatable-body-row").should("have.length", 1);

    // search by surname
    cy.get('input[placeholder="Type to filter users"]')
      .clear()
      .type("SampleSurname");
    cy.get("datatable-body-row").should("have.length", 1);

    cy.get('input[placeholder="Type to filter users"]').clear();

    // Sort by email, username is now the first
    cy.get("span.datatable-header-cell-label").contains("Email").click();

    cy.get("datatable-body-row")
      .first()
      .contains("datatable-body-cell", username);
    cy.get("datatable-body-row")
      .last()
      .contains("datatable-body-cell", username)
      .should("not.exist");

    // Sort by email again, username is now the last
    cy.get("span.datatable-header-cell-label").contains("Email").click();
    cy.get("datatable-body-row")
      .first()
      .contains("datatable-body-cell", username)
      .should("not.exist");

    cy.get("datatable-body-row")
      .last()
      .contains("datatable-body-cell", username);

    cy.wait(1000);
  });

  it("Modify user", () => {
    const username = "aaa0000000000000@sample.org";

    cy.get('input[placeholder="Type to filter users"]').clear().type(username);
    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", username);

    cy.get("datatable-body-row").eq(0).find(".fa-edit").click();
    cy.get('button:contains("Close")').click({ force: true });

    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", "SampleName");

    cy.get("datatable-body-row").eq(0).find(".fa-edit").click();
    cy.get('input[placeholder="Email"]').should("not.exist");
    cy.get('input[placeholder="Name"]').clear().type("NewName");
    cy.get('button:contains("Submit")').click({ force: true });
    cy.get("div[role=alertdialog]")
      .contains("Confirmation: user successfully update")
      .click({ force: true });

    cy.get('input[placeholder="Type to filter users"]').clear().type(username);
    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", "NewName");

    // Restore previous value
    cy.get("datatable-body-row").eq(0).find(".fa-edit").click();
    cy.get('input[placeholder="Name"]').clear().type("SampleName");
    cy.get('button:contains("Submit")').click({ force: true });
    cy.get("div[role=alertdialog]")
      .contains("Confirmation: user successfully update")
      .click({ force: true });
  });

  it("Delete user", () => {
    const username = "aaa0000000000000@sample.org";
    cy.get('input[placeholder="Type to filter users"]').clear().type(username);
    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", username);
    cy.get("datatable-body-row").eq(0).find(".fa-trash").click();
    cy.get("button").contains("Cancel").click();
    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", username);
    cy.get("datatable-body-row").eq(0).find(".fa-trash").click();
    cy.get("button").contains("Confirm").click();

    cy.get("div[role=alertdialog]")
      .contains("Confirmation: user successfully deleted")
      .click({ force: true });

    cy.get('input[placeholder="Type to filter users"]').clear().type(username);

    cy.get("datatable-body-row").should("not.exist");

    cy.get('input[placeholder="Type to filter users"]').clear();

    cy.get("datatable-body-row").its("length").should("be.gte", 1);
  });
});
