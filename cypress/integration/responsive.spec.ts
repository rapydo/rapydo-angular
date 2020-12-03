// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Responsive tests", () => {
  let expected_collapsed_navbar = false;
  it("iphone-4 portrait", () => {
    cy.viewport(320, 480);
    expected_collapsed_navbar = true;
  });

  it("iphone-4 landscape", () => {
    cy.viewport(480, 320);
    expected_collapsed_navbar = true;
  });

  it("iphone-6 portrait", () => {
    cy.viewport(375, 667);
    expected_collapsed_navbar = true;
  });

  it("iphone-6 landscape", () => {
    cy.viewport(667, 375);
  });

  it("ipad-2 portrait", () => {
    cy.viewport(768, 1024);
  });

  it("ipad-2 landscape", () => {
    cy.viewport(1024, 768);
  });

  it("macbook-13 portrait", () => {
    cy.viewport(800, 1280);
  });

  it("macbook-13 landscape", () => {
    cy.viewport(1280, 800);
  });

  it("macbook-15 portrait", () => {
    cy.viewport(900, 1440);
  });

  it("macbook-15 landscape", () => {
    cy.viewport(1440, 900);
  });

  it("macbook-16 portrait", () => {
    cy.viewport(960, 1536);
  });

  it("macbook-16 landscape", () => {
    cy.viewport(1536, 960);
  });

  it("HD Ready portrait", () => {
    cy.viewport(720, 1280);
  });

  it("HD Ready landscape", () => {
    cy.viewport(1280, 720);
  });

  it("Full HD portrait", () => {
    cy.viewport(1080, 1920);
  });

  it("Full HD landscape", () => {
    cy.viewport(1920, 1080);
  });

  it("Quad HD resolution portrait", () => {
    cy.viewport(1440, 2560);
  });

  it("Quad HD resolution landscape", () => {
    cy.viewport(2560, 1440);
  });

  it("4K Ultra HD resolution portrait", () => {
    cy.viewport(2160, 3840);
  });

  it("4K Ultra HD resolution landscape", () => {
    cy.viewport(3840, 2160);
  });

  it("8K portrait", () => {
    cy.viewport(4320, 7680);
  });

  it("8K landscape", () => {
    cy.viewport(7680, 4320);
  });

  afterEach(() => {
    cy.visit("/app/login");

    cy.closecookielaw();

    cy.get("input[placeholder='Your username (email)']").type(
      Cypress.env("AUTH_DEFAULT_USERNAME")
    );
    cy.get("input[placeholder='Your password']").type(
      Cypress.env("AUTH_DEFAULT_PASSWORD")
    );
    cy.get("button").contains("Login").click();

    // search link to access the profile on the navbar

    cy.logout(expected_collapsed_navbar);
  });
});
