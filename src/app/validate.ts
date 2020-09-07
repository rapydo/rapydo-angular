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

  const valid = validator(data);
  if (valid) {
    console.info("Response validated against " + ref + " schema");
    return null;
  }

  console.warn("Response does not meet " + ref + " schema");
  let errors = [];
  for (let error of validator.errors) {
    if (error.keyword == "additionalProperties") {
      errors.push(
        "Found unknown property " + error.params["additionalProperty"]
      );
    } else if (error.keyword == "type") {
      errors.push("Response" + error.dataPath + " " + error.message);
    } else {
      errors.push("Response " + error.message);
    }
  }
  return errors;
}
