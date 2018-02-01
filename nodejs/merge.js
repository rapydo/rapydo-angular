

const merge = require('package-merge');
const fs = require('fs')

var commons = fs.readFileSync('/rapydo/ng2/package.json');

var angularjs = fs.readFileSync('/rapydo/ng2/package.ng1.json');

var custom = fs.readFileSync('/app/frontend/package.json');

fs.writeFileSync("/modules/package.json", merge(commons, angularjs, custom));

