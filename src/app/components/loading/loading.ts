import { Component } from "@angular/core";

// deprecated since 0.7.3
@Component({
  selector: "loading",
  templateUrl: "loading.html",
})
export class LoadingComponent {
  constructor() {
    console.warn("Deprecated use of loading, use ngx-spinner instead");
  }
}
