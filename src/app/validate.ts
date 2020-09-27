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
/* istanbul ignore else */
if (!environment.production) {
  for (let definition in schema["definitions"]) {
    const def = schema["definitions"][definition];
    const ref = "#/definitions/" + definition;
    ajv.addSchema(def, ref);
  }
}

// https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arays-by-string-path
function get_value(obj: any, data_path: string): any {
  // convert indexes to properties
  data_path = data_path.replace(/\[(\w+)\]/g, ".$1");
  // strip a leading dot
  data_path = data_path.replace(/^\./, "");
  const a = data_path.split(".");
  for (let i = 0, n = a.length; i < n; ++i) {
    let k = a[i];
    /* istanbul ignore else */
    if (k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

export function validate(ref, data) {
  // Validation is currently not enabled in production due to limitations with CSP
  /* istanbul ignore if */
  if (environment.production) {
    return null;
  }

  const validator = ajv.getSchema("#/definitions/" + ref);
  if (!validator) {
    console.warn("Validation function " + ref + " not found");
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
      const data_path =
        error.dataPath + "." + error.params["additionalProperty"];
      const value = get_value(data, data_path);
      errors.push(
        "Response contains unknown property: " + data_path + " = " + value
      );
    } else if (error.keyword === "required") {
      // Response should have required property 'xyz'
      errors.push("Response" + error.dataPath + " " + error.message);
    } else if (error.dataPath) {
      const value = get_value(data, error.dataPath);
      errors.push(
        "Response" + error.dataPath + " = " + value + " " + error.message
      );
    } else {
      /* istanbul ignore next */
      errors.push("Response " + error.message);
    }
  }
  return errors;
}
