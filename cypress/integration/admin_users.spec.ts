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
      if ($el.prop("required") && $el.val() == "") {
        if ($el.attr("type") == "text") {
          cy.wrap($el).type("a");
        } else if ($el.attr("type") == "number") {
          cy.wrap($el).type("0");
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
    cy.get("@email").clear().type("newuser@sample.org");
    cy.get("@submit").click({ force: true });

    cy.get("div[role=alertdialog]")
      .contains("Confirmation: user successfully created")
      .click({ force: true });

    cy.get("datatable-body").contains(
      "datatable-body-cell",
      "newuser@sample.org"
    );
  });

  // it("Search user"), () => {

  // }

  // it("Modify user", () => {

  // }

  // it("Delete user", () => {

  // }
});
