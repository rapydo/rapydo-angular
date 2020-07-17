// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("KitchenSink", () => {
  it("TestSink", () => {
    cy.login();

    cy.visit("/app/sink");

    cy.location("pathname").then((pathname) => {
      if (pathname == "/app/sink") {
        // Kitchen Sink is enabled, add here all tests!

        cy.get("div.card-header h4").contains("Kitchen Sink");

        // Normal formly forms
        cy.get("ul.nav-tabs li.nav-item a.active").contains("ngx-formly");

        cy.get("formly-wrapper-form-field");
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

        cy.get('input[placeholder="email"]').clear().type("user@sample.org");
        cy.get('input[placeholder="password"]')
          .clear()
          .type("thisIsVeryS3cret!");
        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"email": "user@sample.org"');
        cy.contains('"password": "thisIsVeryS3cret!"');

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
