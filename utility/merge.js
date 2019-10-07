

const merge = require('package-merge');
const fs = require('fs');

var commons = fs.readFileSync('/app/app/rapydo/package.json');

var custom = fs.readFileSync('/app/app/custom/package.json');

console.log("********************************************************************************")
console.log("Merging package files...");

fs.writeFileSync("/app/package.json", merge(commons, custom));

console.log("[/app/app/rapydo/package.json] + [/app/app/custom/package.json] -> [/app/package.json]");
console.log("********************************************************************************")

