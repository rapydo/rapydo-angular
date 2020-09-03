import { Injectable, Pipe } from "@angular/core";

@Pipe({
  name: "boolean_flag",
})
@Injectable()
export class BooleanFlagPipe {
  transform(str): string {
    if (str === true) {
      return "<i class='fas fa-check fa-lg green'></i>";
    }

    if (str === false) {
      return "<i class='fas fa-times fa-lg red'></i>";
    }

    return str;
  }
}
