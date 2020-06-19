import { Component } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  templateUrl: `404.html`,
})
export class Error404Component {
  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }
}
