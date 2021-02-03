import "@cypress/code-coverage/support";
import "cypress-localstorage-commands";
import { totp } from "otplib";

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
    const secret = Cypress.env("TESTING_TOTP_HASH");
    const token = totp.generate(secret);

    body["totp_code"] = token;
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

Cypress.Commands.add("closecookielaw", () => {
  cy.get("cookie-law").within((el) => {
    cy.root().should("have.attr", "seen", "false");

    cy.get("div.cookie-law-wrapper").find("button").click();
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

Cypress.Commands.add("createuser", (email, pwd, expired = false) => {
  cy.visit("/app/admin/users");

  // Mostly copied from admin_users.spec.ts

  cy.get('button:contains("new user")').click();

  cy.get('input[placeholder="Email"]').clear().type(email);
  cy.get('input[placeholder="Password"]').clear().type(pwd);
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
});

Cypress.Commands.add("deleteuser", (email) => {
  cy.visit("/app/admin/users");

  cy.get('input[placeholder="Type to filter users"]').clear().type(email);

  cy.get("datatable-body-row").first().find(".fa-trash").click();
  cy.get("h5.modal-title").contains("Confirmation required");
  cy.get("button").contains("Yes, delete").click();

  cy.checkalert("Confirmation: user successfully deleted");
});
