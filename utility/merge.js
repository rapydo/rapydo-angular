const { Console } = require("console");
const print = new Console(process.stdout, process.stderr);

const fs = require("fs");
const merge = require("deepmerge");

function mergeJSON(commonsPath, customPath, outputPath) {
  if (fs.existsSync(customPath)) {
    let commonsContent = require(commonsPath);
    let customContent = require(customPath);
    let mergedContent = JSON.stringify(merge(commonsContent, customContent));

    print.log("\nMerging files...");
    fs.writeFile(outputPath, mergedContent, "utf8", function (err) {
      if (err) {
        print.log("An error occured while writing JSON Object to File.");
        print.log(err);
        return false;
      }

      print.log(
        "[" + commonsPath + "] + [" + customPath + "] -> [" + outputPath + "]\n"
      );
    });
  } else {
    print.log("\nCopying core file...");
    let commonsContent = fs.readFileSync(commonsPath);
    fs.writeFileSync(outputPath, commonsContent);
    print.log("[" + commonsPath + "] -> [" + outputPath + "]\n");
  }
}

mergeJSON(
  "/app/app/rapydo/package.json",
  "/app/app/custom/package.json",
  "/app/package.json"
);

mergeJSON(
  "/app/app/rapydo/angular.json",
  "/app/app/custom/angular.json",
  "/app/angular.json"
);

return true;
