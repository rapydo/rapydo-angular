import { enableProdMode } from "@angular/core";
import { environment } from "@rapydo/../environments/environment";

import "localstorage-polyfill";
import * as domino from "domino";
import { join } from "path";

// import * as fs from "fs";

// Use the browser index.html as template for the mock window
// const template = fs.readFileSync("///index.html").toString();
const template = join("/app", "dist", "index.html");

// Shim for the global window and document objects.
const window: any = domino.createWindow(template);
global["window"] = window;
global["document"] = window.document;
global["localStorage"] = localStorage;

if (environment.production) {
  enableProdMode();
}

import "zone.js/dist/zone";
export { AppServerModule } from "@rapydo/app.server.module";
export { renderModule, renderModuleFactory } from "@angular/platform-server";
