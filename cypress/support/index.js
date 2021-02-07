import "@cypress/code-coverage/support";
import "cypress-localstorage-commands";
import * as OTPAuth from "otpauth";

import { get_totp } from "../fixtures/utilities";

// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

Cypress.Commands.add("login", (email = null, pwd = null) => {
  if (email === null) {
    email = Cypress.env("AUTH_DEFAULT_USERNAME");
  }

  if (pwd === null) {
    pwd = Cypress.env("AUTH_DEFAULT_PASSWORD");
  }

  let body = { username: email, password: pwd };
  if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
    const totp = new OTPAuth.TOTP({ secret: Cypress.env("TESTING_TOTP_HASH") });

    body["totp_code"] = totp.generate();
  }
  cy.request({
    method: "POST",
    url: Cypress.env("API_URL") + "auth/login",
    body,
  }).then((response) => {
    cy.setLocalStorage("token", JSON.stringify(response.body));

    const options = {
      method: "GET",
      url: Cypress.env("API_URL") + "auth/profile",
      headers: {
        Authorization: `Bearer ${response.body}`,
      },
    };

    cy.request(options).then((response) => {
      cy.setLocalStorage("currentUser", JSON.stringify(response.body));
    });
  });
});

Cypress.Commands.add("logout", (collapsed = false) => {
  if (collapsed) {
    cy.get("button.navbar-toggler").click();

    // cy.get("a").find(".fa-sign-out-alt").parent().click({ force: true });
    // cy.get("div.modal-footer")
    //   .find("button")
    //   .contains("Confirm")
    //   .click({ force: true });

    cy.get("i.fa-sign-out-alt").parent().click();
    cy.scrollTo("top");
    cy.get("button").contains("Confirm").click();
  } else {
    cy.get("i.fa-sign-out-alt").parent().click();
    cy.get("button").contains("Confirm").click();
  }
});

Cypress.Commands.add("closecookielaw", (quiet = false) => {
  cy.get("cookie-law").within((el) => {
    if (quiet) {
      // no assumptions on the banner, if open will be closed, otherwise ignored
      cy.root()
        .should("have.attr", "seen")
        .then((seen) => {
          if (seen == "false") {
            cy.get("div.cookie-law-wrapper").find("button").click();
          }
        });
    } else {
      // assume the banner is open and has to be closed
      cy.root().should("have.attr", "seen", "false");

      cy.get("div.cookie-law-wrapper").find("button").click();
    }
  });
});

Cypress.Commands.add("checkalert", (msg) => {
  // cy.wait(200);
  cy.get("div[role=alertdialog]").contains(msg).click({ force: true });
});

Cypress.Commands.add("checkvalidation", (index, msg) => {
  cy.get("formly-validation-message").eq(index).contains(msg);
});

Cypress.Commands.add("getmail", () => {
  return cy.readFile("/logs/mock.mail.lastsent.body");
});

Cypress.Commands.add(
  "createuser",
  (email, pwd, expired = false, init_user = true) => {
    // init_user = change first password and accept terms of use

    // If expired do not init the user
    if (expired) {
      init_user = false;
    }
    cy.login();

    cy.visit("/app/admin/users");

    // Mostly copied from admin_users.spec.ts

    cy.get('button:contains("new user")').click();

    cy.get('input[placeholder="Email"]').clear().type(email);
    if (
      init_user &&
      (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === 1 ||
        Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION"))
    ) {
      cy.get('input[placeholder="Password"]')
        .clear()
        .type(pwd + "!");
    } else {
      cy.get('input[placeholder="Password"]').clear().type(pwd);
    }
    cy.get('input[placeholder="Name"]').clear().type("SampleName");
    cy.get('input[placeholder="Surname"]').clear().type("SampleSurname");

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

    if (expired) {
      cy.get(
        'input[placeholder="This user will be blocked after this date"]'
      ).click();
      cy.get(
        'ngb-datepicker-navigation-select select[title="Select year"]'
      ).select("2020");

      cy.get(
        'ngb-datepicker-navigation-select select[title="Select month"]'
      ).select("12");

      cy.get("div.ngb-dp-day div").contains("31").click({ force: true });
    }
    cy.get('button:contains("Submit")').click({ force: true });

    cy.checkalert("Confirmation: user successfully created");

    cy.logout();

    if (init_user) {
      cy.visit("/app/login");

      cy.location().should((location) => {
        expect(location.pathname).to.eq("/app/login");
      });

      cy.closecookielaw(true);
      cy.intercept("POST", "/auth/login").as("login");

      cy.get("input[placeholder='Your username (email)']").type(email);
      if (
        Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === 1 ||
        Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")
      ) {
        cy.get("input[placeholder='Your password']").type(pwd + "!");
      } else {
        cy.get("input[placeholder='Your password']").type(pwd);
      }

      cy.get("button").contains("Login").click();

      cy.wait("@login");

      cy.wait(300);

      if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
        cy.get("div.card-header h4").contains(
          "Configure Two-Factor with Google Auth"
        );

        cy.get("input[placeholder='Your new password']").type(pwd);
        cy.get("input[placeholder='Confirm your new password']").type(pwd);
        cy.get("input[placeholder='TOTP verification code']").type(get_totp());

        cy.intercept("POST", "/auth/login").as("login");
        cy.get("button").contains("Authorize").click();
        cy.wait("@login");
      } else if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === 1) {
        cy.get("div.card-header.bg-warning h4").contains(
          "Please change your temporary password"
        );

        cy.checkalert("Please change your temporary password");

        cy.get('input[placeholder="Your new password"]').clear().type(pwd);
        cy.get('input[placeholder="Confirm your new password"]')
          .clear()
          .type(pwd);

        cy.intercept("POST", "/auth/login").as("login");
        cy.get('button:contains("Change")').click({ force: true });
        cy.wait("@login");
      }

      if (Cypress.env("ALLOW_TERMS_OF_USE")) {
        cy.get("div.modal-footer h4").contains(
          "Do you accept all our Terms of Use?"
        );
        cy.get("div.modal-footer button").first().contains("YES").click();
      }

      cy.logout();
    }
  }
);

Cypress.Commands.add("deleteuser", (email) => {
  cy.visit("/app/admin/users");

  cy.get('input[placeholder="Type to filter users"]').clear().type(email);

  cy.get("datatable-body-row").first().find(".fa-trash").click();
  cy.get("h5.modal-title").contains("Confirmation required");
  cy.get("button").contains("Yes, delete").click();

  cy.checkalert("Confirmation: user successfully deleted");
});
