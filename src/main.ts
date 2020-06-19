import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { AppModule } from "./app/app.module";
import { environment } from "@rapydo/../environments/environment";

// required libs for angular
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";
import "reflect-metadata/Reflect";

let opts: any = {};
if (environment.production) {
  enableProdMode();
  opts.preserveWhitespaces = false;
}

document.addEventListener("DOMContentLoaded", () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule, opts)
    .then((ref) => {
      // Ensure Angular destroys itself on hot reloads.
      if (window["ngRef"]) {
        window["ngRef"].destroy();
      }
      window["ngRef"] = ref;

      // Otherise, log the boot error
    })
    .catch((err) => console.error(err));
});
