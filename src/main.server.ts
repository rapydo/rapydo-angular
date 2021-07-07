import { enableProdMode } from "@angular/core";
import { environment } from "@rapydo/../environments/environment";

import "localstorage-polyfill";

global["localStorage"] = localStorage;

if (environment.production) {
  enableProdMode();
}

import "zone.js/dist/zone";
export { AppServerModule } from "@rapydo/app.server.module";
export { renderModule, renderModuleFactory } from "@angular/platform-server";
