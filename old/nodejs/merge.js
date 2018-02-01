

const merge = require('package-merge');
const fs = require('fs')

var commons = fs.readFileSync('/rapydo/package.json');

var angularjs = fs.readFileSync('/rapydo/package.ng1.json');

var custom = fs.readFileSync('/app/frontend/package.json');

fs.writeFileSync("/modules/package.json", merge(commons, angularjs, custom));

