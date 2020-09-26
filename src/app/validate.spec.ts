import { validate } from "@rapydo/validate";

describe("Validate", () => {
  it("validate", () => {
    let data = {
      invalid: "invalid",
    };

    expect(validate("InvalidSchema", data)).toBeNull();

    data = {
      email: "sample@nomail.org",
      name: "Name",
      surname: "Surname",
    };
    expect(validate("SimpleUser", data)).toBeNull();
  });
});
