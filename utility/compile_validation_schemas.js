const Ajv = require("/app/node_modules/ajv");
const addFormats = require("/app/node_modules/ajv-formats");

const schema = require("/app/app/types.json");
const standaloneCode = require("/app/node_modules/ajv/dist/standalone");

const ajv = new Ajv.default({ code: { source: true } });
addFormats(ajv);

const validate = ajv.compile(schema);

for (let definition in schema["definitions"]) {
  const def = schema["definitions"][definition];
  const ref = "#/definitions/" + definition;

  console.log("    Adding " + ref);
  ajv.addSchema(def, ref);
}

let moduleCode = standaloneCode.default(ajv);

const fs = require("fs");
const path = require("path");
fs.writeFileSync("/app/app/validate.js", moduleCode);
