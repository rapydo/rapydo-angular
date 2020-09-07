import * as Ajv from "ajv";
import * as schema from "@rapydo/../../types.json";

const ajv = Ajv({
  allErrors: true,
  strictDefaults: true,
  strictKeywords: true,
  strictNumbers: true,
});

for (let definition in schema["definitions"]) {
  const def = schema["definitions"][definition];
  const ref = "#/definitions/" + definition;
  ajv.addSchema(def, ref);
}

export function validate(ref, data) {
  const validator = ajv.getSchema("#/definitions/" + ref);
  if (!validator) {
    console.warn("Validation function not found");
    return null;
  }

  console.log("Validating against " + ref + " schema");
  const valid = validator(data);
  if (valid) {
    return null;
  }

  let errors = [];
  for (let error of validator.errors) {
    if (error.keyword == "additionalProperties") {
      errors.push(
        "Found unknown property " + error.params["additionalProperty"]
      );
    } else {
      errors.push("Response " + error.message);
    }
  }
  return errors;
}
