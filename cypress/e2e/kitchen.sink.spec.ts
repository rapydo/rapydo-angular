// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("KitchenSink", () => {
  beforeEach(() => {
    // cy.login();

    cy.visit("/app/sink");
  });

  it("TestSink - ngx-formly - default layout", () => {
    cy.location("pathname").then((pathname) => {
      // Is Kitchen Sink enabled?
      if (pathname === "/app/sink") {
        // quiet = true => no error if already closed
        cy.closecookielaw(true);
        cy.get("div.card-header h1").contains("Kitchen Sink");

        // Normal formly forms
        cy.get("ul.nav-tabs li.nav-item a.active").contains("ngx-formly");

        cy.get("formly-wrapper-form-field");
        cy.get('button:contains("Submit")').click({ force: true });
        // This is email
        cy.checkvalidation(0, "This field is required");
        // This is password
        cy.checkvalidation(1, "This field is required");
        // This is url
        cy.checkvalidation(2, "This field is required");

        cy.get('input[placeholder="email"]').as("email");
        cy.get('input[placeholder="password"]').as("pwd");
        cy.get('input[placeholder="date"]').as("date");
        cy.get('input[placeholder="url"]').as("url");
        cy.get('input[placeholder="text"]').as("text");
        cy.get('input[placeholder="number"]').as("number");

        cy.get("@email").clear().type("Invalid");
        cy.checkvalidation(0, "Invalid email address");

        cy.get("@email").clear().type("user@sample.org");
        cy.get("@pwd").clear().type("thisIsVeryS3cret!");

        // to verify that the placeholder works
        cy.get("@date").click();
        // first click opens, second click closes
        cy.get("@date").click();
        // to verify that the type is ngbdatepicker
        cy.get("input[ngbdatepicker]").click();

        cy.get(
          'ngb-datepicker-navigation-select select[title="Select year"]',
        ).as("year");

        const current_year = new Date().getFullYear();
        // The year select you have 3 value:
        cy.get("@year").find("option").should("have.length", 4);
        // The first is curret year - 1
        cy.get("@year")
          .find("option")
          .eq(0)
          .contains((current_year - 1).toString());
        // The second is current year
        cy.get("@year").find("option").eq(1).contains(current_year.toString());
        // The third is curret year + 1
        cy.get("@year")
          .find("option")
          .eq(2)
          .contains((current_year + 1).toString());
        // The fourth is current year + 2
        cy.get("@year")
          .find("option")
          .eq(2)
          .contains((current_year + 1).toString());
        // Just to verify that the values are selectable
        cy.get("@year").select(current_year.toString());
        cy.get("@year").select((current_year - 1).toString());
        // Let's select the third year (current + 1)
        // The fourth is incomplete and only selectable to current day, i.e.
        // at 02 Jan 2021 only dates between 02 Jan 2020 and 02 Jan 2022 are enabled
        cy.get("@year").select((current_year + 1).toString());

        cy.get(
          'ngb-datepicker-navigation-select select[title="Select month"]',
        ).select("5");

        cy.get("div.ngb-dp-day div").contains("19").click({ force: true });

        cy.get("@url").clear().type("invalid");
        cy.checkvalidation(0, "Invalid web address");

        cy.get("@url").clear().type("www.google.");
        cy.checkvalidation(0, "Invalid web address");

        cy.get("@url").clear().type("www.google.c");
        cy.checkvalidation(0, "Invalid web address");

        // This is to force the existence of a validation message and let the
        // cy.get("formly-validation-message").should("not.contain")
        // to work. Otherwise the get will fail...
        cy.get("@email").clear();
        cy.checkvalidation(0, "This field is required");

        cy.get("@url").clear().type("www.google.co");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address",
        );

        cy.get("@url").clear().type("wwwgoogle.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address",
        );

        // Not allowed in cypress...
        // cy.get('input[ngbdatepicker]').should('be.readonly')

        cy.get("@url").clear().type("http://www.google.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address",
        );

        cy.get("@url").clear().type("https://www.google.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address",
        );

        cy.get("@url").clear().type("httpx://www.google.com");
        cy.checkvalidation(1, "Invalid web address");

        cy.get("@url").clear().type("ftp://www.google.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address",
        );

        cy.get("@url").clear().type("user@sample.org");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address",
        );

        cy.get("@url").clear().type("www.google.com");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Invalid web address",
        );

        cy.get("@text").clear().type("123");
        cy.checkvalidation(1, "Should have at least 4 characters");
        cy.get("@text").clear().type("1234");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Should have at least 4 characters",
        );
        cy.get("@text").clear().type("12345678");
        // due to max: 6 on field definition
        cy.get("@text").should("have.value", "123456");
        // this validation error is never shown because
        // the input does not permit to include more than specified max
        cy.get("formly-validation-message").should(
          "not.contain",
          "Should have no more than 6 characters",
        );

        cy.get("@number").clear().type("0");
        cy.checkvalidation(1, "Should be greater than 1");
        cy.get("@number").clear().type("10");
        cy.checkvalidation(1, "Should be lower than 9");
        cy.get("@number").clear().type("5");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Should be greater than 1",
        );
        cy.get("formly-validation-message").should(
          "not.contain",
          "Should be lower than 9",
        );

        cy.get("@number").clear().type("2.5");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Should be greater than 1",
        );
        cy.get("formly-validation-message").should(
          "not.contain",
          "Should be lower than 9",
        );

        // 30e-1 == 3
        cy.get("@number").clear().type("30e-1");
        cy.get("formly-validation-message").should(
          "not.contain",
          "Should be greater than 1",
        );
        cy.get("formly-validation-message").should(
          "not.contain",
          "Should be lower than 9",
        );

        // Let's remove the validation error introduced to ease check of missing errors
        cy.get("@email").clear().type("user@sample.org");

        cy.get('input:checkbox[placeholder="boolean"]').check({ force: true });

        // test the select field [1 / 2], select the first element
        // open the options
        cy.get("ng-select").eq(0).find("input").click({ force: true });

        // and select the first (that is eq(1) because eq(0) is an empty option)
        cy.get("ng-dropdown-panel")
          .find("div.ng-option")
          .eq(1)
          .click({ force: true });

        // test multi-select
        // enable the options dropdown
        cy.get("ng-select").eq(1).find("input").click({ force: true });
        // select the third option
        cy.get("ng-dropdown-panel")
          .find("div.ng-option")
          .eq(2)
          .click({ force: true });

        // verify that the selected option is the cow
        cy.get("ng-select")
          .eq(1)
          .find("span.ng-value-label")
          .eq(0)
          .contains("Bos taurus");

        // filter the options
        cy.get("ng-select").eq(1).find("input").type("sus");
        cy.get("ng-dropdown-panel")
          .find("div.ng-option")
          .eq(0)
          .click({ force: true });

        // verify that the first selected option is still the cow
        cy.get("ng-select")
          .eq(1)
          .find("span.ng-value-label")
          .eq(0)
          .contains("Bos taurus");

        // verify that the second selected option is the pig
        cy.get("ng-select")
          .eq(1)
          .find("span.ng-value-label")
          .eq(1)
          .contains("Sus scrofa domesticus");

        cy.contains("Option1");
        cy.contains("Option2");
        cy.contains("Option3");
        cy.contains("Description 3");
        cy.contains("Option4");
        cy.contains("Description 4");

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"email": "user@sample.org"');
        cy.contains('"password": "thisIsVeryS3cret!"');
        cy.contains('"url": "www.google.com"');
        cy.contains('"text": "123456"');
        cy.contains('"number": 3');
        cy.contains('"boolean": true');
        cy.contains('"select": "first-key"');
        cy.contains('"multiselect"');
        cy.contains('"cow"');
        cy.contains('"pig"');

        cy.contains('"date": "' + (current_year + 1) + '-05-19T00:00:00.000Z"');

        // test the select field [2 / 2], filter and the select the new first element
        cy.get("ng-select").eq(0).find("input").type("third");
        cy.get("ng-dropdown-panel")
          .eq(0)
          .find("div.ng-option")
          .eq(0)
          .click({ force: true });
        cy.contains('"select": "third-key"');

        // Remove an element from the multiselect
        cy.get("ng-select")
          .eq(1)
          .find("span.ng-value-icon")
          .eq(0)
          .click({ force: true });
        cy.contains('"multiselect"');
        cy.contains('"cow"').should("not.exist");
        cy.contains('"pig"');

        cy.get("i.fa-calendar-minus").parent().click();
        cy.get('button:contains("Submit")').click({ force: true });
        cy.contains('"date": null');
      }
    });
  });

  it("TestSink - ngx-formly - horizontal layout", () => {
    cy.location("pathname").then((pathname) => {
      // Is Kitchen Sink enabled?
      if (pathname === "/app/sink") {
        // Horizontal formly forms
        cy.get("ul.nav-tabs li.nav-item a")
          .contains("horizontal forms")
          .click();

        cy.get("formly-horizontal-wrapper");

        cy.get('input[placeholder="email"]').as("email");
        cy.get('input[placeholder="password"]').as("pwd");
        cy.get('input[placeholder="date"]').as("date");
        cy.get('input[placeholder="url"]').as("url");
        cy.get('input[placeholder="text"]').as("text");
        cy.get('input[placeholder="number"]').as("number");

        cy.get("@email").clear();
        cy.get("@pwd").clear();

        cy.get('button:contains("Submit")').click({ force: true });
        cy.checkvalidation(0, "This field is required");
        cy.checkvalidation(1, "This field is required");

        cy.get("@email").clear().type("Invalid");
        cy.checkvalidation(0, "Invalid email address");

        cy.get("@email").clear().type("user2@sample.org");
        cy.get("@pwd").clear().type("thisIsSUPERS3cret!");

        cy.get("@date").click();

        cy.get(
          'ngb-datepicker-navigation-select select[title="Select year"]',
        ).as("year");

        const current_year = new Date().getFullYear();
        // Let's select the third year (current + 1)
        // The fourth is incomplete and only selectable to current day, i.e.
        // at 02 Jan 2021 only dates between 02 Jan 2020 and 02 Jan 2022 are enabled
        cy.get("@year").select((current_year + 1).toString());

        cy.get(
          'ngb-datepicker-navigation-select select[title="Select month"]',
        ).select("5");

        cy.get("div.ngb-dp-day div").contains("19").click({ force: true });

        cy.get("@url").clear().type("http://www.google.com");
        cy.get("@text").clear().type("1234");
        cy.get("@number").clear().type("5");

        // open the ng-select options and pick the first element
        cy.get("ng-select").eq(0).find("input").click({ force: true });

        // and select the first (that is eq(1) because eq(0) is an empty option)
        cy.get("ng-dropdown-panel")
          .find("div.ng-option")
          .eq(1)
          .click({ force: true });

        // open the multiple ng-select options and pick the first element
        cy.get("ng-select").eq(1).find("input").click({ force: true });

        // and select the first (that is eq(1) because eq(0) is an empty option)
        cy.get("ng-dropdown-panel")
          .find("div.ng-option")
          .eq(1)
          .click({ force: true });

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"email": "user2@sample.org"');
        cy.contains('"password": "thisIsSUPERS3cret!"');
      }
    });
  });

  it("TestSink - Upload", () => {
    cy.location("pathname").then((pathname) => {
      // Is Kitchen Sink enabled?
      if (pathname === "/app/sink") {
        cy.get("ul.nav-tabs li.nav-item a").contains("ngx-uploadx").click();

        cy.closecookielaw(true);

        cy.get("input[type=file]").selectFile({
          contents: Cypress.Buffer.from("file contents"),
          fileName: "file.txt",
          mimeType: "text/plain",
          lastModified: Date.now(),
        });

        cy.get("#upload_speed").contains("Upload speed");
      }
    });
  });

  it("TestSink - Datatables", () => {
    cy.location("pathname").then((pathname) => {
      // Is Kitchen Sink enabled?
      if (pathname === "/app/sink") {
        cy.get("ul.nav-tabs li.nav-item a").contains("ngx-datatable").click();
      }
    });
  });

  it("TestSink - Autocomplete", () => {
    cy.location("pathname").then((pathname) => {
      // Is Kitchen Sink enabled?
      if (pathname === "/app/sink") {
        // From put => single with show id OFF
        cy.get("ul.nav-tabs li.nav-item a").contains("Autocomplete").click();

        // this is needed because the component is auto-cleaned after 500 msec
        cy.wait(600);

        cy.get("input").as("field");

        // 1 - select an element, verify the label and the key in the model
        cy.get("@field").clear().type("h");
        cy.get("@field").type("a");
        cy.get("@field").type("r");

        // also includes the debounceTime
        cy.wait(1000);

        cy.get("ng-dropdown-panel")
          .get("div.ng-option")
          .eq(0)
          .click({ force: true });

        cy.get("ng-select")
          .find("span.ng-value-label")
          .contains("Harry Smith the Kid");

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"element": "HSK"');

        // 2 - select an other element
        cy.get("@field").clear().type("J");
        cy.get("@field").type("o");
        cy.get("@field").type("n");
        cy.get("@field").type("e");
        cy.get("@field").type("s");
        cy.get("@field").type(" ");
        cy.get("@field").type("t");
        cy.get("@field").type("h");
        cy.get("@field").type("e");
        cy.get("@field").type(" ");

        // also includes the debounceTime
        cy.wait(1000);

        cy.get("ng-dropdown-panel")
          .find("div.ng-option")
          .eq(0)
          .click({ force: true });

        cy.get("ng-select")
          .find("span.ng-value-label")
          .contains("Oliver Jones the Kid");

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"element": "OJK"');
        cy.contains('"element": "HSK"').should("not.exist");
      }
    });
  });

  it("TestSink - Multi Autocomplete", () => {
    cy.location("pathname").then((pathname) => {
      // Is Kitchen Sink enabled?
      if (pathname === "/app/sink") {
        // From post => multiple with show id ON
        cy.get("ul.nav-tabs li.nav-item a")
          .contains("Multi Autocomplete")
          .click();

        cy.get("input").as("field");

        // this is needed because the component is auto-cleaned after 500 msec
        cy.wait(600);

        // 1 - Select Oliver Smith
        cy.get("@field").clear().type("o");
        cy.get("@field").type("l");
        cy.get("@field").type("i");

        // also includes the debounceTime
        cy.wait(1000);

        cy.get("ng-dropdown-panel")
          .get("div.ng-option")
          .eq(0)
          .click({ force: true });

        cy.get("ng-select")
          .find("span.ng-value-label")
          .eq(0)
          .contains("Oliver Smith the Kid");

        // 2 - Select Oliver Jones
        cy.get("@field").clear().type("s");
        cy.get("@field").type(" ");
        cy.get("@field").type("t");
        cy.get("@field").type("h");
        cy.get("@field").type("e");
        cy.get("@field").type(" ");

        // also includes the debounceTime
        cy.wait(1000);

        cy.get("ng-dropdown-panel")
          .get("div.ng-option")
          .eq(0)
          .click({ force: true });

        cy.get("ng-select")
          .find("span.ng-value-label")
          .eq(0)
          .contains("Oliver Smith the Kid");
        cy.get("ng-select")
          .find("span.ng-value-label")
          .eq(1)
          .contains("Oliver Jones the Kid");

        cy.get('button:contains("Submit")').click({ force: true });
        cy.contains('"elements"');
        cy.contains('"OSK"');
        cy.contains('"OJK"');

        // 3 - Remove Oliver Jones
        // select again the same element will remove it from the list
        cy.get("@field").clear().type("oliver jones the kid");

        // also includes the debounceTime
        cy.wait(1000);

        cy.get("ng-dropdown-panel")
          .get("div.ng-option")
          .eq(0)
          .click({ force: true });

        cy.get("ng-select")
          .find("span.ng-value-label")
          .eq(0)
          .contains("Oliver Smith the Kid");

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"elements"');
        cy.contains('"OJK"').should("not.exist");
        cy.contains('"OSK"');

        // 4 - Remove Oliver Smith, add some Charlie
        // (otherwise the validation will fail because the field is required)
        // this is the x icon to delete the item
        cy.get("ng-select").find("span.ng-value-icon").click({ force: true });

        cy.get("@field").clear().type("charlie");

        // also includes the debounceTime
        cy.wait(1000);

        cy.get("ng-dropdown-panel")
          .get("div.ng-option")
          .eq(0)
          .click({ force: true });

        cy.get('button:contains("Submit")').click({ force: true });

        cy.contains('"elements"');
        cy.contains('"OSK"').should("not.exist");
        cy.contains('"OJK"').should("not.exist");
      }
    });
  });
  it("TestSink - Preloaded Autocomplete", () => {
    cy.location("pathname").then((pathname) => {
      // Is Kitchen Sink enabled?
      if (pathname === "/app/sink") {
        // From post with previous model => multple with show id ON and preloaded data
        cy.get("ul.nav-tabs li.nav-item a")
          .contains("Preloaded Autocomplete")
          .click();

        cy.get("input").as("field");

        // this is needed because the component is auto-cleaned after 500 msec
        cy.wait(600);

        // Verify preloaded data
        cy.get('button:contains("Submit")').click({ force: true });
        cy.contains('"elements"');
        cy.contains('"CSK"');
        cy.contains('"JWR"');
        cy.get("@field").clear().type("harr");
        cy.get("@field").type("y s");
        cy.get("@field").type("mith t");
        cy.get("@field").type("he u");

        // also includes the debounceTime
        cy.wait(1000);

        cy.get("ng-dropdown-panel")
          .get("div.ng-option")
          .eq(0)
          .click({ force: true });

        cy.get('button:contains("Submit")').click({ force: true });
        cy.contains('"elements"');
        cy.contains('"CSK"');
        cy.contains('"JWR"');
        cy.contains('"HSU"');
      }
    });
  });
});
