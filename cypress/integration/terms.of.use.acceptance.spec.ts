// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Terms of use", () => {
  beforeach(() => {
    const username = "bbb0000000000000@sample.org";
    cy.login();

    cy.visit("/app/admin/users");

    cy.closecookielaw();

    // Mostly copied from admin_users.spec.ts
    cy.get('button:contains("new user")').click();

    cy.get('input[placeholder="Email"]').as("email");
    cy.get('input[placeholder="Password"]').as("password");
    cy.get('input[placeholder="Name"]').as("name");
    cy.get('input[placeholder="Surname"]').as("surname");
    cy.get('button:contains("Submit")').as("submit");

    cy.get("@email").clear().type(username);
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

    cy.get("@submit").click({ force: true });

    cy.checkalert("Confirmation: user successfully created");

    cy.get("a").find(".fa-sign-out-alt").parent().click();
    cy.get("button").contains("Confirm").click();
  });

  beforeEach(() => {
    cy.visit("/app/login");

    cy.get("input[placeholder='Your username (email)']").clear().type(newUser);
    cy.get("input[placeholder='Your password']")
      .clear()
      .type(newPassword + "{enter}");
  });

  if (Cypress.env("ALLOW_TERMS_OF_USE")) {
    it("Terms of Use acceptance", () => {
      cy.get("div.modal-header h4.modal-title").contains("Terms of use");
    });
  } else {
    it("Terms of Use not enabled", () => {
      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/profile");
      });
    });
  }

  after(() => {
    cy.get("a").find(".fa-sign-out-alt").parent().click();
    cy.get("button").contains("Confirm").click();

    cy.login();

    cy.visit("/app/admin/users");

    const username = "bbb0000000000000@sample.org";

    cy.get('input[placeholder="Type to filter users"]').clear().type(username);
    cy.get("datatable-body-row")
      .eq(0)
      .contains("datatable-body-cell", username);
    cy.get("datatable-body-row").eq(0).find(".fa-trash").click();
    cy.get("h3.popover-title").contains("Confirmation required");
    cy.get("button").contains("Confirm").click();

    cy.checkalert("Confirmation: user successfully deleted");
  });
});
