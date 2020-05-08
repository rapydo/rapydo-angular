const { Console } = require('console');
const print = new Console(process.stdout, process.stderr);

const fs = require('fs');
const merge = require('deepmerge');

function mergeJSON(commonsPath, customPath, outputPath) {

    if (fs.existsSync(customPath)) {

        let commons_content = require(commonsPath);
        let custom_content = require(customPath);
        let merged_content = JSON.stringify(merge(commons_content, custom_content));

        print.log("\nMerging files...");
        fs.writeFile(outputPath, merged_content, 'utf8', function (err) {
            if (err) {
                print.log("An error occured while writing JSON Object to File.");
                print.log(err);
                return false;
            }
         
            print.log("["+commonsPath+"] + ["+customPath+"] -> ["+outputPath+"]\n");
        });
    } else {
        print.log("\nCopying core file...");
        let commons_content = fs.readFileSync(commonsPath);
        fs.writeFileSync(outputPath, commons_content);
        print.log("["+commonsPath+"] -> ["+outputPath+"]\n");
    }

}

mergeJSON(
    '/app/app/rapydo/package.json',
    '/app/app/custom/package.json',
    '/app/package.json'
);

mergeJSON(
    '/app/app/rapydo/angular.json',
    '/app/app/custom/angular.json',
    '/app/angular.json'
);

return true;