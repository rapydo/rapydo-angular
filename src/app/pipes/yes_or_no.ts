import { Injectable, Pipe } from "@angular/core";

@Pipe({
  name: "yes_or_no",
})
@Injectable()
export class YesNoPipe {
  transform(str): string {
    if (str === null) {
      return "NO";
    }

    if (str === true) {
      return "YES";
    }

    if (str === false) {
      return "NO";
    }

    return str;
  }
}
