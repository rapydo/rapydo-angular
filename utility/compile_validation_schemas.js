const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const schema = require("/app/app/types.json");
const standaloneCode = require("ajv/dist/standalone");

const ajv = new Ajv.default({ code: { source: true } });
addFormats(ajv);

const mapping = {};
for (let definition in schema["definitions"]) {
  mapping[definition] = "#/definitions/" + definition;
  console.log("    Adding " + definition);
}

ajv.addSchema(schema);

const moduleCode = standaloneCode.default(ajv, mapping);

const fs = require("fs");
const path = require("path");
fs.writeFileSync("/app/app/validate.js", moduleCode);
