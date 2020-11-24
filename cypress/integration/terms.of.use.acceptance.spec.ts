// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Terms of use", () => {
  before(() => {
    cy.login();

    cy.visit("/app/admin/users");

    cy.closecookielaw();

    cy.createuser("bbb000@sample.org", "looooong");

    cy.logout();
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
    cy.logout();

    cy.login();

    cy.visit("/app/admin/users");

    const username = "bbb000@sample.org";

    cy.deleteuser(username);
  });
});
