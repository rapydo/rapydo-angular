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
      // The body of a for-in should be wrapped in an if statement
      // to filter unwanted properties from the prototype.
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        keys.push({ key, value: value[key] });
      }
    }
    return keys;
  }
}
