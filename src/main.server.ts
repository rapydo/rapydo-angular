import { enableProdMode } from "@angular/core";
import { environment } from "@rapydo/../environments/environment";

import "zone.js/dist/zone";

// import * as domino from "domino";
// import * as fs from "fs";

import "localstorage-polyfill";

// Use the browser index.html as template for the mock window
// const template = fs.readFileSync("/app/dist/index.html").toString();

// Shim for the global window and document objects.
// const window: any = domino.createWindow(template);
// global['window'] = window;
// global['document'] = window.document;
global["localStorage"] = localStorage;

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from "@rapydo/app.server.module";
export { renderModule, renderModuleFactory } from "@angular/platform-server";
