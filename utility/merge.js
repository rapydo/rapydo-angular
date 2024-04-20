const { Console } = require("console");
const print = new Console(process.stdout, process.stderr);

const fs = require("fs");
const merge = require("deepmerge");

function mergeJSON(commonsPath, customPath, outputPath) {
  if (fs.existsSync(customPath)) {
    let commonsContent = require(commonsPath);
    let customContent = require(customPath);
    let merged = merge(commonsContent, customContent);
    let mergedContent = JSON.stringify(merged, null, 4);

    print.log("\nMerging files...");
    fs.writeFile(outputPath, mergedContent, "utf8", function (err) {
      if (err) {
        print.log("An error occured while writing JSON Object to File.");
        print.log(err);
        return false;
      }

      print.log(
        "[" + commonsPath + "] + [" + customPath + "] -> [" + outputPath + "]",
      );
    });
  } else {
    print.log("\nCopying core file...");
    let commonsContent = fs.readFileSync(commonsPath);
    fs.writeFileSync(outputPath, commonsContent);
    print.log("[" + commonsPath + "] -> [" + outputPath + "]");
  }
}

mergeJSON(
  "/app/app/rapydo/package.json",
  "/app/app/custom/package.json",
  "/app/package.json",
);

mergeJSON(
  "/app/app/rapydo/angular.json",
  "/app/app/custom/angular.json",
  "/app/angular.json",
);

const i18nCommonsPath = "/app/app/rapydo/i18n";
if (fs.existsSync(i18nCommonsPath)) {
  fs.readdir(i18nCommonsPath, function (err, files) {
    if (err) {
      print.log("Could not list i18n directory.", err);
      return false;
    }
    files.forEach(function (file, index) {
      mergeJSON(
        `${i18nCommonsPath}/${file}`,
        `/app/app/custom/assets/i18n/${file}`,
        `/app/app/rapydo/assets/i18n/${file}`,
      );
    });
  });
}

return true;
