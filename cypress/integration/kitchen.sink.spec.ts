// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("KitchenSink", () => {
  it("TestSink", () => {
    cy.login();

    cy.visit("/app/sink");

    cy.closecookielaw();

    cy.location("pathname").then((pathname) => {
      if (pathname === "/app/sink") {
        // Kitchen Sink is enabled, add here all tests!

        cy.get("div.card-header h4").contains("Kitchen Sink");

        // Normal formly forms
        cy.get("ul.nav-tabs li.nav-item a.active").contains("ngx-formly");

        cy.get("formly-wrapper-form-field");
        cy.get('button:contains("Submit")').click({ force: true });
        // This is email
        cy.get("formly-validation-message")
          .eq(0)
          .contains("This field is required");
        // This is password
        cy.get("formly-validation-message")
          .eq(1)
          .contains("This field is required");

        cy.get('input[placeholder="email"]').clear().type("Invalid");
        cy.get("formly-validation-message")
          .eq(0)
          .contains("Invalid email address");

        cy.get('input[placeholder="email"]').clear().type("user@sample.org");
        cy.get('input[placeholder="password"]')
          .clear()
          .type("thisIsVeryS3cret!");

        // Not allowed in cypress...
        // cy.get('input[ngbdatepicker]').should('be.readonly')

        // to verify that the placeholder works
        cy.get('input[placeholder="date"]').click();
        // first click opens, second click closes
        cy.get('input[placeholder="date"]').click();
        // to verify that the type is ngbdatepicker
        cy.get("input[ngbdatepicker]").click();

        cy.get(
          'ngb-datepicker-navigation-select select[title="Select month"]'
        ).select("5");
        cy.get(
          'ngb-datepicker-navigation-select select[title="Select year"]'
        ).select("1981");
        cy.get("div.ngb-dp-day div").contains("19").click({ force: true });

        cy.contains("Option1");
        cy.contains("Option2");
        cy.contains("Option3");
        cy.contains("Description 3");
        cy.contains("Option4");
        cy.contains("Description 4");

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"email": "user@sample.org"');
        cy.contains('"password": "thisIsVeryS3cret!"');
        cy.contains('"date": "1981-05-19T12:00:00.000Z"');

        cy.get("button.btn-outline-danger").find("i.fa-times").parent().click();
        cy.get('button:contains("Submit")').click({ force: true });
        cy.contains('"date": null');

        // Horizontal formly forms
        cy.get("ul.nav-tabs li.nav-item a")
          .contains("horizontal forms")
          .click();

        cy.get("formly-horizontal-wrapper");

        cy.get('input[placeholder="email"]').clear();
        cy.get('input[placeholder="password"]').clear();

        cy.get('button:contains("Submit")').click({ force: true });
        cy.get("formly-validation-message")
          .eq(0)
          .contains("This field is required");
        cy.get("formly-validation-message")
          .eq(1)
          .contains("This field is required");

        cy.get('input[placeholder="email"]').clear().type("Invalid");
        cy.get("formly-validation-message")
          .eq(0)
          .contains("Invalid email address");

        cy.get('input[placeholder="email"]').clear().type("user2@sample.org");
        cy.get('input[placeholder="password"]')
          .clear()
          .type("thisIsSUPERS3cret!");

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"email": "user2@sample.org"');
        cy.contains('"password": "thisIsSUPERS3cret!"');

        // Upload
        cy.get("ul.nav-tabs li.nav-item a").contains("ngx-uploadx").click();

        // Datatables
        cy.get("ul.nav-tabs li.nav-item a").contains("ngx-datatable").click();

        // What more??
      }
    });
  });
});
