// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import { getpassword } from "../utilities";

if (Cypress.env("ALLOW_TERMS_OF_USE")) {
  describe("Terms of use", () => {
    const username = "bbb000@sample.org";
    let pwd = getpassword(4);

    before(() => {
      cy.login();

      cy.visit("/app/admin/users");

      cy.closecookielaw();

      cy.createuser(username, pwd);

      cy.logout();
    });

    it("Terms of Use - not accepted", () => {
      cy.visit("/app/login");

      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(username);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(pwd + "{enter}");

      if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === "True") {
        cy.get("div.card-header")
          .should("have.class", "bg-warning")
          .find("h4")
          .contains("Please change your temporary password");

        cy.checkalert("Please change your temporary password");

        pwd = pwd + "!";

        cy.get('input[placeholder="Your new password"]').clear().type(pwd);
        cy.get('input[placeholder="Confirm your new password"]')
          .clear()
          .type(pwd);
        cy.get('button:contains("Change")').click({ force: true });
      }

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
      cy.visit("/app/login");

      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(username);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(pwd + "{enter}");

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
      cy.visit("/app/login");

      cy.get("input[placeholder='Your username (email)']")
        .clear()
        .type(username);
      cy.get("input[placeholder='Your password']")
        .clear()
        .type(pwd + "{enter}");

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

    after(() => {
      cy.logout();

      cy.login();

      cy.visit("/app/admin/users");

      cy.deleteuser(username);
    });
  });
}
