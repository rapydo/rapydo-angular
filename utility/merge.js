

const merge = require('package-merge');
const fs = require('fs')

var commons = fs.readFileSync('/rapydo/package.json');

var custom = fs.readFileSync('/app/frontend/package.json');

console.log("********************************************************************************")
console.log("Merging package files...");

fs.writeFileSync("/modules/package.json", merge(commons, custom));

console.log("[/rapydo/package.json] + [/app/frontend/package.json] -> [/modules/package.json]");
console.log("********************************************************************************")

