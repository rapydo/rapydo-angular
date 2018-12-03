const merge = require('package-merge');
const fs = require('fs');

var commons = fs.readFileSync('/rapydo/package.json');

var custom = fs.readFileSync('/app/frontend/package.json');

process.stdout.write("********************************************************************************\n");
process.stdout.write("Merging package files...\n");

fs.writeFileSync("/modules/package.json", merge(commons, custom));

process.stdout.write("[/rapydo/package.json] + [/app/frontend/package.json] -> [/modules/package.json]\n");
process.stdout.write("********************************************************************************\n");
