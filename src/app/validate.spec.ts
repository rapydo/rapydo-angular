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

    errors = validate("SimpleUser", {
      email: "sample@nomail.org",
      name: "Name",
    });

    expect(errors).not.toBeNull();
    expect(errors[0]).not.toBeUndefined();
    expect(errors[0]).toBe("Response should have required property 'surname'");

    errors = validate("SimpleUser", {
      email: "sample@nomail.org",
      name: "Name",
      surname: 42,
    });

    expect(errors).not.toBeNull();
    expect(errors[0]).not.toBeUndefined();
    expect(errors[0]).toBe("Response.surname = 42 should be string");

    errors = validate("Groups", [
      {
        shortname: "Name",
        fullname: "Fullname",
      },
    ]);

    expect(errors).not.toBeNull();
    expect(errors[0]).not.toBeUndefined();
    expect(errors[0]).toBe("Response[0] should have required property 'uuid'");

    errors = validate("Groups", [
      {
        shortname: "Name",
        fullname: "Fullname",
        extra: "invalid",
      },
    ]);

    expect(errors).not.toBeNull();
    expect(errors[0]).not.toBeUndefined();
    expect(errors[0]).toBe(
      "Response contains unknown property: [0].extra = invalid"
    );

    errors = validate("Groups", [
      {
        shortname: "Name",
        fullname: "Fullname",
        uuid: 42,
      },
    ]);

    expect(errors).not.toBeNull();
    expect(errors[0]).not.toBeUndefined();
    expect(errors[0]).toBe("Response[0].uuid = 42 should be string");
  });
});
