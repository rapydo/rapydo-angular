import * as Ajv from "ajv";
import * as schema from "@rapydo/../../types.json";
import { environment } from "@rapydo/../environments/environment";

const ajv = Ajv({
  allErrors: true,
  strictDefaults: true,
  strictKeywords: true,
  strictNumbers: true,
});

// Validation is currently not enabled in production due to limitations with CSP
if (!environment.production) {
  for (let definition in schema["definitions"]) {
    const def = schema["definitions"][definition];
    const ref = "#/definitions/" + definition;
    ajv.addSchema(def, ref);
  }
}

export function validate(ref, data) {
  // Validation is currently not enabled in production due to limitations with CSP
  if (environment.production) {
    return null;
  }

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
    if (error.keyword === "additionalProperties") {
      errors.push(
        "Found unknown property " + error.params["additionalProperty"]
      );
    } else if (error.dataPath) {
      errors.push("Response" + error.dataPath + " " + error.message);
    } else {
      errors.push("Response " + error.message);
    }
  }
  return errors;
}
