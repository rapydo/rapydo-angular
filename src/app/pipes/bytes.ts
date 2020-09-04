import { Injectable, Pipe } from "@angular/core";

const units = ["bytes", "kB", "MB", "GB", "TB", "PB"];

@Pipe({
  name: "bytes",
})
@Injectable()
export class BytesPipe {
  transform(bytes: number, precision: number = null): string {
    if (bytes === 0) {
      return "0";
    }
    if (bytes === -1 || Number.isNaN(bytes) || !isFinite(bytes)) {
      return "-";
    }

    const num = Math.floor(Math.log(bytes) / Math.log(1024));

    if (precision === null) {
      precision = num <= 1 ? 0 : 1;
    }

    const value = (bytes / Math.pow(1024, Math.floor(num))).toFixed(precision);
    return value + " " + units[num];
  }
}
