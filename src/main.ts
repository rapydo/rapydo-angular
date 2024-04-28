import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { AppModule } from "@rapydo/app.module";
import { environment } from "@rapydo/../environments/environment";

// required libs for angular
import "zone.js";
import "reflect-metadata/Reflect";

if (environment.production) {
  enableProdMode();
  window.console.log = function () {};
}

document.addEventListener("DOMContentLoaded", () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
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
