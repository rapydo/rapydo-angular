import { Injectable, Pipe } from "@angular/core";

@Pipe({
  name: "iterate",
})
@Injectable()
export class IteratePipe {
  // Used to iterate over objects, as for user in profile
  // for any other use case use keyvalue pipe
  transform(value): any {
    let keys = [];

    for (let key in value) {
      keys.push({ key, value: value[key] });
    }
    return keys;
  }
}

@Pipe({
  name: "bytes",
})
@Injectable()
export class BytesPipe {
  transform(bytes: number = 0, precision: number = null): string {
    if (bytes === 0) {
      return "0";
    }
    if (bytes === -1 || Number.isNaN(bytes) || !isFinite(bytes)) {
      return "-";
    }

    let units = ["bytes", "kB", "MB", "GB", "TB", "PB"],
      number = Math.floor(Math.log(bytes) / Math.log(1024));

    if (precision === null) {
      precision = number <= 1 ? 0 : 1;
    }

    value = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);
    return value + " " + units[number];
  }
}

@Pipe({
  name: "boolean_flag",
})
@Injectable()
export class BooleanFlagPipe {
  transform(str): string {
    if (str === true) {
      return "<i class='fas fa-check fa-large fa-green'></i>";
    }

    if (str === false) {
      return "<i class='fas fa-times fa-large fa-red'></i>";
    }

    return str;
  }
}

@Pipe({
  name: "yes_or_no",
})
@Injectable()
export class YesNoPipe {
  transform(str): string {
    if (str === true) {
      return "YES";
    }

    if (str === false) {
      return "NO";
    }

    return str;
  }
}
