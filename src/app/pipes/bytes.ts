import { Injectable, Pipe } from "@angular/core";

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

    /* istanbul ignore else */
    if (precision === null) {
      precision = number <= 1 ? 0 : 1;
    }

    const value = (bytes / Math.pow(1024, Math.floor(number))).toFixed(
      precision
    );
    return value + " " + units[number];
  }
}
