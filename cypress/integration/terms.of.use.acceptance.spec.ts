// This is to silence ESLint about undefined cy
/*global cy, Cypress*/

describe("Terms of use", () => {
  it("User Creation", () => {});

  if (Cypress.env("ALLOW_TERMS_OF_USE")) {
    it("Terms of Use acceptance", () => {});
  } else {
    it("Terms of Use not enabled", () => {});
  }

  it("User Deletion", () => {});
});
