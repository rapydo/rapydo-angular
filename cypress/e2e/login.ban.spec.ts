// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

import {
  getpassword,
  get_random_username,
  get_totp,
} from "../fixtures/utilities";

describe("Login Ban", () => {
  if (Cypress.env("AUTH_MAX_LOGIN_ATTEMPTS") > 0) {
    it("Credentials unlock page with wrong token", () => {
      cy.visit("/app/login/unlock/invalidtoken");

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/login/unlock/invalidtoken");
      });

      cy.get("div.card-header h1").contains("Invalid unlock token");

      cy.get("div.card-body p").contains(
        "The received token is not valid, if you copied the URL please verify that you copied all parts of it."
      );
      cy.get("div.card-body p").contains(
        "If the URL is correct the token could be invalid because your credentials are already unlocked."
      );
      cy.get("div.card-body p").contains("To verify that you can try to");

      cy.checkalert("Invalid unlock token");

      cy.get("a:contains('login')").first().click();

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/login");
      });
    });

    it("Ban after wrong password", () => {
      const email = get_random_username("testloginban1");
      const pwd = getpassword(4);

      cy.createuser(email, pwd);

      // 10 is the default used by backend (services/authentication) in testing mode
      const max_failures = Math.max(Cypress.env("AUTH_MAX_LOGIN_ATTEMPTS"), 10);

      cy.visit("/app/login");
      cy.get("div.card-header h1").contains("Login");
      cy.get("input[placeholder='Your username (email)']").clear().type(email);
      for (let i = 0; i < max_failures; i++) {
        cy.get("input[placeholder='Your password']")
          .clear()
          .type(getpassword(4), { parseSpecialCharSequences: false });
        cy.get("button").contains("Login").click();
        cy.checkalert("Invalid access credentials");
      }

      cy.get("input[placeholder='Your password']")
        .clear()
        .type(pwd, { parseSpecialCharSequences: false });
      cy.get("button").contains("Login").click();
      cy.checkalert(
        "Sorry, this account is temporarily blocked due to the number of failed login attempts."
      );

      cy.visit("/public/reset");
      cy.get("input[id=formly_1_input_reset_email_0]").clear().type(email);
      cy.get("button:contains('Submit request')").click();
      cy.checkalert(
        "Sorry, this account is temporarily blocked due to the number of failed login attempts."
      );

      cy.getmail().then((body) => {
        let re = /.*https?:\/\/.*\/unlock\/([A-Za-z0-9-\.\+_]+)[\s\S]*$/;
        var token = body.match(re);

        cy.visit("/app/login/unlock/" + token[1]);

        cy.checkalert("Credentials successfully unlocked");

        cy.wait(200);

        cy.location().should((location) => {
          expect(location.pathname).to.eq("/app/login");
        });

        cy.login(email, pwd);
        cy.goto_profile();
      });

      cy.login();
      cy.deleteuser(email);
    });

    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      it("Ban after wrong totp", () => {
        const email = get_random_username("testloginban2");
        const pwd = getpassword(4);

        cy.createuser(email, pwd);
        // 10 is the default used by backend (services/authentication) in testing mode
        const max_failures = Math.max(
          Cypress.env("AUTH_MAX_LOGIN_ATTEMPTS"),
          10
        );

        cy.visit("/app/login");
        cy.get("div.card-header h1").contains("Login");
        cy.get("input[placeholder='Your username (email)']")
          .clear()
          .type(email);
        cy.get("input[placeholder='Your password']")
          .clear()
          .type(pwd, { parseSpecialCharSequences: false });
        cy.get("button").contains("Login").click();

        cy.get("input[placeholder='Your password']").should("not.exist");
        cy.get("div.card-header h1").contains("Provide the verification code");

        for (let i = 0; i < max_failures; i++) {
          cy.get("input[placeholder='TOTP verification code']")
            .clear()
            .type("000000");
          cy.get("button").contains("Authorize").click();
          cy.checkalert("Verification code is not valid");
        }

        cy.get("input[placeholder='TOTP verification code']")
          .clear()
          .type(get_totp());
        cy.get("button").contains("Authorize").click();
        cy.checkalert(
          "Sorry, this account is temporarily blocked due to the number of failed login attempts."
        );

        cy.visit("/public/reset");
        cy.get("input[id=formly_1_input_reset_email_0]").clear().type(email);
        cy.get("button:contains('Submit request')").click();
        cy.checkalert(
          "Sorry, this account is temporarily blocked due to the number of failed login attempts."
        );

        cy.getmail().then((body) => {
          let re = /.*https?:\/\/.*\/unlock\/([A-Za-z0-9-\.\+_]+)[\s\S]*$/;
          var token = body.match(re);

          cy.visit("/app/login/unlock/" + token[1]);

          cy.checkalert("Credentials successfully unlocked");

          cy.wait(200);

          cy.location().should((location) => {
            expect(location.pathname).to.eq("/app/login");
          });

          cy.login(email, pwd);
          cy.goto_profile();
        });

        cy.login();
        cy.deleteuser(email);
      });
    }
  }
});
