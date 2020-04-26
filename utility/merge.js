const { Console } = require('console');
const print = new Console(process.stdout, process.stderr);

const fs = require('fs');
const merge = require('deepmerge');

function merge_json(commons_path, custom_path, output_path) {

    if (fs.existsSync(custom_path)) {

        let commons_content = require(commons_path);
        let custom_content = require(custom_path);
        let merged_content = JSON.stringify(merge(commons_content, custom_content));

        print.log("\nMerging files...");
        fs.writeFile(output_path, merged_content, 'utf8', function (err) {
            if (err) {
                print.log("An error occured while writing JSON Object to File.");
                print.log(err);
                return false;
            }
         
            print.log("["+commons_path+"] + ["+custom_path+"] -> ["+output_path+"]\n");
        });
    } else {
        print.log("\nCopying core file...");
        let commons_content = fs.readFileSync(commons_path);
        fs.writeFileSync(output_path, commons_content);
        print.log("["+commons_path+"] -> ["+output_path+"]\n");
    }

}

merge_json(
    '/app/app/rapydo/package.json',
    '/app/app/custom/package.json',
    '/app/package.json'
);

merge_json(
    '/app/app/rapydo/angular.json',
    '/app/app/custom/angular.json',
    '/app/angular.json'
);

return true;