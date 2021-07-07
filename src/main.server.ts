import { enableProdMode } from "@angular/core";
import { environment } from "@rapydo/../environments/environment";

import "localstorage-polyfill";

const MockBrowser = require("mock-browser").mocks.MockBrowser;
const mock = new MockBrowser();
global["window"] = mock.getWindow();
global["localStorage"] = localStorage;

if (environment.production) {
  enableProdMode();
}

import "zone.js/dist/zone";
export { AppServerModule } from "@rapydo/app.server.module";
export { renderModule, renderModuleFactory } from "@angular/platform-server";
