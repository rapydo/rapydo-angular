import "@cypress/code-coverage/support";
import "cypress-localstorage-commands";

import { get_totp } from "../fixtures/utilities";

// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

Cypress.Commands.add("change_expired_password", (email, pwd, formtype) => {
  cy.checkalert("Your password is expired, please change it");

  cy.get("input[placeholder='Your new password']")
    .clear()
    .type(pwd + "!");
  cy.get("input[placeholder='Confirm your new password']")
    .clear()
    .type(pwd + "!");

  if (formtype == 1) {
    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.checkalert("You do not provided a valid verification code");
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
      cy.get("button").contains("Authorize").click();
    } else {
      cy.get("button").contains("Change").click();
    }
  } else if (formtype == 2) {
    // Version 2
    if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
      cy.get("input[placeholder='TOTP verification code']")
        .clear()
        .type(get_totp());
    }
    cy.get("button").contains("Change").click();
  }

  cy.get("input[placeholder='Your new password']").should("not.exist");

  cy.wait(300);

  cy.visit("/app/profile/changepassword");

  cy.location().should((location) => {
    expect(location.pathname).to.eq("/app/profile/changepassword");
  });

  cy.get("div.card-header h1").contains("Change your password");

  cy.get('input[placeholder="Type here your current password"]')
    .clear()
    .type(pwd + "!");
  cy.get('input[placeholder="Type the desidered new password"]')
    .clear()
    .type(pwd);
  cy.get('input[placeholder="Type again the new password for confirmation"]')
    .clear()
    .type(pwd);

  if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
    cy.get('input[placeholder="TOTP verification code"]')
      .clear()
      .type(get_totp());
  }

  cy.get("button:contains('Submit')").click();

  cy.location().should((location) => {
    expect(location.pathname).to.not.eq("/app/profile/changepassword");
  });

  // With TOTP after password change the user has to login again
  // Automatic login with new password is not possible due to the TOTP request
  if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
    cy.get("div.card-header h1").contains("Login");

    cy.get("input[placeholder='Your username (email)']").type(email);
    cy.get("input[placeholder='Your password']").type(pwd);

    cy.get("button").contains("Login").click();

    cy.get("input[placeholder='Your password']").should("not.exist");

    cy.get("div.card-header.bg-warning h1").contains(
      "Provide the verification code"
    );
    cy.get("input[placeholder='TOTP verification code']")
      .clear()
      .type(get_totp());

    cy.get("button").contains("Authorize").click();

    cy.location().should((location) => {
      expect(location.pathname).to.not.eq("/app/login");
    });
  }
});

Cypress.Commands.add("login", (email = null, pwd = null) => {
  if (email === null) {
    email = Cypress.env("AUTH_DEFAULT_USERNAME");
  }

  if (pwd === null) {
    pwd = Cypress.env("AUTH_DEFAULT_PASSWORD");
  }

  cy.visit("/app/login");

  cy.closecookielaw(true);

  cy.get("input[placeholder='Your username (email)']").clear().type(email);
  cy.get("input[placeholder='Your password']").clear().type(pwd);
  cy.get("button").contains("Login").click();
  cy.get("input[placeholder='Your password']").should("not.exist");

  cy.get("body").then((body) => {
    if (body.find("h1").length > 0) {
      cy.wrap(body)
        .get("h1")
        .then(($title) => {
          const t = $title.text();

          if (t == "Provide the verification code") {
            cy.get("input[placeholder='TOTP verification code']")
              .clear()
              .type(get_totp());
            cy.get("button").contains("Authorize").click();

            cy.get("button:contains('Authorize')").should("not.exist");
            cy.wait(300);

            cy.get("body").then((body2) => {
              if (body2.find("h1").length > 0) {
                cy.wrap(body2)
                  .get("h1")
                  .then(($title) => {
                    const t = $title.text();
                    if (t == "Your password is expired, please change it") {
                      cy.change_expired_password(email, pwd, 2);
                    }
                  });
              }
            });
          } else if (t == "Your password is expired, please change it") {
            cy.change_expired_password(email, pwd, 1);
          }
        });
    }
  });

  // Why this wait?
  // Cypress does not offer a way to automatically wait for all pending XHR requests and
  // often some requests e.g. GET /auth/status, are still under the hook when this click
  // arrives causing the request interruption and inconsistences and make the tests fail
  cy.wait(300);
});

// It is executed once by the first test to change the temporary password of the default user
Cypress.Commands.add("login_and_init_user", (email = null, pwd = null) => {
  if (email === null) {
    email = Cypress.env("AUTH_DEFAULT_USERNAME");
  }

  if (pwd === null) {
    pwd = Cypress.env("AUTH_DEFAULT_PASSWORD");
  }

  cy.visit("/app/login");

  cy.get("input[placeholder='Your username (email)']").clear().type(email);
  cy.get("input[placeholder='Your password']").clear().type(pwd);
  cy.get("button").contains("Login").click();
  cy.get("input[placeholder='Your password']").should("not.exist");

  if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
    cy.get("div.card-header h1").contains(
      "Configure Two-Factor with Google Authenticator"
    );

    cy.checkalert("Please change your temporary password");
    cy.checkalert("You do not provided a valid verification code");

    cy.get("input[placeholder='Your new password']")
      .clear()
      .type(pwd + "!");
    cy.get("input[placeholder='Confirm your new password']")
      .clear()
      .type(pwd + "!");
    cy.get("input[placeholder='TOTP verification code']").type(get_totp());

    cy.intercept("POST", "/auth/login").as("login");
    cy.get("button").contains("Authorize").click();
    cy.wait("@login");
    cy.wait(200);
  } else if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === 1) {
    cy.get("div.card-header.bg-warning h1").contains(
      "Please change your temporary password"
    );

    cy.checkalert("Please change your temporary password");

    cy.get('input[placeholder="Your new password"]')
      .clear()
      .type(pwd + "!");
    cy.get('input[placeholder="Confirm your new password"]')
      .clear()
      .type(pwd + "!");

    cy.intercept("POST", "/auth/login").as("login");
    cy.get('button:contains("Change")').click({ force: true });
    cy.wait("@login");
    cy.wait(200);
  }
  // Why this wait?
  // Cypress does not offer a way to automatically wait for all pending XHR requests and
  // often some requests e.g. GET /auth/status, are still under the hook when this click
  // arrives causing the request interruption and inconsistences and make the tests fail
  cy.wait(300);
});

// Login Via Request:
//       let body = { username: email, password: pwd };
//       if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
//         const totp = new OTPAuth.TOTP({
//           secret: Cypress.env("TESTING_TOTP_HASH"),
//         });

//         body["totp_code"] = totp.generate();
//       }

//       cy.request({
//         method: "POST",
//         url: Cypress.env("API_URL") + "auth/login",
//         body,
//       }).then((response) => {
//         cy.setLocalStorage("token", JSON.stringify(response.body));

//         const options = {
//           method: "GET",
//           url: Cypress.env("API_URL") + "auth/profile",
//           headers: {
//             Authorization: `Bearer ${response.body}`,
//           },
//         };

//         cy.request(options).then((response) => {
//           cy.setLocalStorage("currentUser", JSON.stringify(response.body));
//         });
//       });

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

// Replaces cy.visit("/app/profile") to introduces automatic waits on DOM elements
// instead of requiring waits on the http call
Cypress.Commands.add("goto_profile", (collapsed = false) => {
  if (collapsed) {
    cy.get("button.navbar-toggler").click();
  }

  // Why this wait?
  // Cypress does not offer a way to automatically wait for all pending XHR requests and
  // often some requests e.g. GET /auth/status, are still under the hook when this click
  // arrives causing the request interruption and inconsistences and make the tests fail
  cy.wait(300);

  cy.get("i.fa-user").parent().click();

  cy.location().should((location) => {
    expect(location.pathname).to.eq("/app/profile");
  });
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
  cy.get("div[role=alertdialog]").contains(msg).click({ force: true });
});

Cypress.Commands.add("checkvalidation", (index, msg) => {
  cy.get("formly-validation-message").eq(index).contains(msg);
});

Cypress.Commands.add("getmail", (previous = false) => {
  if (previous) {
    return cy.readFile("/logs/mock.mail.prevsent.body");
  }
  return cy.readFile("/logs/mock.mail.lastsent.body");
});

Cypress.Commands.add(
  "createuser",
  (email, pwd, expired = false, init_user = true, roles = null) => {
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
    cy.get('input[placeholder="Name"]').clear().type("PlaceholderName");
    cy.get('input[placeholder="Surname"]').clear().type("PlaceholderSurname");

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
        // open the ng-select options and pick the first element
        cy.wrap($el).find("input").click({ force: true });
        cy.wrap($el).find("div.ng-option").eq(1).click({ force: true });
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

    if (roles != null && roles.length > 0) {
      // Remove any previous roles
      cy.get("ng-select")
        .eq(0)
        .find("span.ng-value-icon")
        .each(($el, index, $list) => {
          cy.wrap($el).click({ force: true });
        });

      // Add new roles
      for (let role_name of roles) {
        cy.get("ng-select").eq(0).find("input").type(role_name);
        cy.get("ng-dropdown-panel")
          .find("div.ng-option")
          .eq(0)
          .click({ force: true });
      }
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

      if (Cypress.env("AUTH_SECOND_FACTOR_AUTHENTICATION")) {
        cy.get("input[placeholder='Your password']").should("not.exist");

        cy.get("div.card-header h1").contains(
          "Configure Two-Factor with Google Authenticator"
        );

        cy.get("input[placeholder='Your new password']").clear().type(pwd);
        cy.get("input[placeholder='Confirm your new password']")
          .clear()
          .type(pwd);
        cy.get("input[placeholder='TOTP verification code']")
          .clear()
          .type(get_totp());

        cy.intercept("POST", "/auth/login").as("login");
        cy.get("button").contains("Authorize").click();
        cy.wait("@login");
      } else if (Cypress.env("AUTH_FORCE_FIRST_PASSWORD_CHANGE") === 1) {
        cy.get("input[placeholder='Your password']").should("not.exist");
        cy.get("div.card-header.bg-warning h1").contains(
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
        cy.get("div.modal-footer h1").contains(
          "Do you accept our Terms of Use?"
        );
        cy.get("div.modal-footer button").first().contains("YES").click();
        cy.wait(300);
      }

      cy.logout();
    }
  }
);

Cypress.Commands.add("deleteuser", (email) => {
  cy.visit("/app/admin/users");

  cy.get('input[placeholder="Type to filter users"]').clear().type(email);

  cy.get("datatable-body-row").first().find(".fa-trash").click();
  cy.get("h2.modal-title").contains("Confirmation required");
  cy.get("button").contains("Yes, delete").click();

  cy.checkalert("Confirmation: user successfully deleted");
});
