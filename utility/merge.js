const { Console } = require('console');

const merge = require('package-merge');
const fs = require('fs');

const print = new Console(process.stdout, process.stderr);

let commonsPackage = fs.readFileSync('/app/app/rapydo/package.json');
if (fs.existsSync('/app/app/custom/package.json')) {

    let custom = fs.readFileSync('/app/app/custom/package.json');

    print.log("\nMerging package files...");

    fs.writeFileSync("/app/package.json", merge(commonsPackage, custom));

    print.log("[/app/app/rapydo/package.json] + [/app/app/custom/package.json] -> [/app/package.json]\n");
} else {
    print.log("\nCopying package file...");
    fs.writeFileSync("/app/package.json", commonsPackage);
    print.log("/app/app/rapydo/package.json -> [/app/package.json]\n");
}

if (fs.existsSync('/app/app/custom/angular.json')) {

    const merge = require('deepmerge');
    let commonsAngular = require('/app/app/rapydo/angular.json');
    let custom = require('/app/app/custom/angular.json');
    let jsonContent = JSON.stringify(merge(commonsAngular, custom));
    /*
    let custom = fs.readFileSync('/app/app/custom/angular.json');

    print.log("\nMerging angular files...");

    fs.writeFileSync("/app/angular.json", merge(commonsAngular, custom));

    print.log("[/app/app/rapydo/angular.json] + [/app/app/custom/angular.json] -> [/app/angular.json]\n");
    */

    /*
    print.log("\nAngular.json merge is not supported, copying file...");
    fs.writeFileSync("/app/angular.json", commonsAngular);
    */
    fs.writeFile("/app/angular.json", jsonContent, 'utf8', function (err) {
        if (err) {
            print.log("An error occured while writing JSON Object to File.");
            print.log(err);
            return false;
        }
     
        print.log("/app/app/rapydo/angular.json -> [/app/angular.json]\n");
    });

} else {
    print.log("\nCopying angular file...");
    let commonsAngular = fs.readFileSync('/app/app/rapydo/angular.json');
    fs.writeFileSync("/app/angular.json", commonsAngular);
    print.log("/app/app/rapydo/angular.json -> [/app/angular.json]\n");
}

return true;