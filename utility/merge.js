

const merge = require('package-merge');
const fs = require('fs');

var commons_package = fs.readFileSync('/app/app/rapydo/package.json');
if (fs.existsSync('/app/app/custom/package.json')) {

	var custom = fs.readFileSync('/app/app/custom/package.json');

	console.log("\nMerging package files...");

	fs.writeFileSync("/app/package.json", merge(commons_package, custom));

	console.log("[/app/app/rapydo/package.json] + [/app/app/custom/package.json] -> [/app/package.json]\n");
} else {
	console.log("\nCopying package file...");
	fs.writeFileSync("/app/package.json", commons_package);
	console.log("/app/app/rapydo/package.json -> [/app/package.json]\n");
}

var commons_angular = fs.readFileSync('/app/app/rapydo/angular.json');
if (fs.existsSync('/app/app/custom/angular.json')) {

	/*
	var custom = fs.readFileSync('/app/app/custom/angular.json');

	console.log("\nMerging angular files...");

	fs.writeFileSync("/app/angular.json", merge(commons_angular, custom));

	console.log("[/app/app/rapydo/angular.json] + [/app/app/custom/angular.json] -> [/app/angular.json]\n");
	*/

	console.log("\nAngular.json merge is not supported, copying file...");
	fs.writeFileSync("/app/angular.json", commons_angular);
	console.log("/app/app/rapydo/angular.json -> [/app/angular.json]\n");
} else {
	console.log("\nCopying angular file...");
	fs.writeFileSync("/app/angular.json", commons_angular);
	console.log("/app/app/rapydo/angular.json -> [/app/angular.json]\n");
}