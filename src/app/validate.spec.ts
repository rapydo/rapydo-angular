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

    let errors = validate("SimpleUser", {
      email: "sample@nomail.org",
      name: "Name",
      surname: "Surname",
      extra: "invalid",
    });

    expect(errors).not.toBeNull();
    expect(errors[0]).not.toBeUndefined();
    expect(errors[0]).toBe(
      "Response contains unknown property: .extra = invalid"
    );

    errors = validate("SimpleUser", {
      email: "sample@nomail.org",
      name: "Name",
      surname: "Surname",
      extra: null,
    });

    expect(errors).not.toBeNull();
    expect(errors[0]).not.toBeUndefined();
    expect(errors[0]).toBe("Response contains unknown property: .extra = null");
  });
});
