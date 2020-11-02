// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Terms of use", () => {
  before(() => {
    const username = "bbb000@sample.org";
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

    // Pick all the selects, included Groups and any other custom fields (like in IMC)
    cy.get("form")
      .find("select")
      .each(($el, index, $list) => {
        if ($el.prop("required")) {
          cy.wrap($el)
            .find("option")
            .eq(1)
            .then((element) => {
              cy.wrap($el).select(element.val());
            });
        }
      });

    cy.get("@submit").click({ force: true });

    cy.checkalert("Confirmation: user successfully created");

    cy.get("a").find(".fa-sign-out-alt").parent().click();
    cy.get("button").contains("Confirm").click();
  });

  beforeEach(() => {
    const username = "bbb000@sample.org";
    cy.visit("/app/login");

    cy.get("input[placeholder='Your username (email)']").clear().type(username);
    cy.get("input[placeholder='Your password']")
      .clear()
      .type("looooong{enter}");
  });

  if (Cypress.env("ALLOW_TERMS_OF_USE")) {
    it("Terms of Use - not accepted", () => {
      cy.get("div.modal-header h4.modal-title").contains("Terms of use");

      cy.get("div.modal-footer h4").contains(
        "Do you accept all our Terms of Use?"
      );

      cy.get("div.modal-footer button").first().contains("YES");
      cy.get("div.modal-footer button").last().contains("NO").click();

      cy.checkalert(
        "We apologize but you are not allowed to login, as you have not accepted our Terms of Use"
      );
    });

    it("Terms of Use - accepted", () => {
      cy.get("div.modal-header h4.modal-title").contains("Terms of use");

      cy.get("div.modal-footer h4").contains(
        "Do you accept all our Terms of Use?"
      );

      cy.get("div.modal-footer button").last().contains("NO");

      cy.get("div.modal-footer button").first().contains("YES").click();

      cy.location().should((location) => {
        expect(location.pathname).to.not.equal("/app/login");
      });
    });

    it("Terms of Use - already accepted", () => {
      cy.location().should((location) => {
        expect(location.pathname).to.not.equal("/app/login");
      });

      cy.visit("/app/profile");

      cy.get("table")
        .find("th")
        .contains("Privacy Accepted")
        .parent()
        .find(".fa-check");
    });
  } else {
    it("Terms of Use not enabled", () => {
      cy.location().should((location) => {
        expect(location.pathname).to.not.equal("/app/login");
      });
    });
  }

  after(() => {
    cy.get("a").find(".fa-sign-out-alt").parent().click();
    cy.get("button").contains("Confirm").click();

    cy.login();

    cy.visit("/app/admin/users");

    const username = "bbb000@sample.org";

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
