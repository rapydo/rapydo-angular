import { validate } from "@rapydo/validate";

describe("Validate", () => {
  it("validate", () => {
    expect(validate("InvalidSchema", { invalid: "invalid" })).toBeNull();

    expect(
      validate("SimpleUser", {
        email: "sample@nomail.org",
        name: "Name",
        surname: "Surname",
      })
    ).toBeNull();
  });
});
