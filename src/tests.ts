// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/dist/zone-testing";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the core and custom tests.
const rapydo = require.context("../rapydo/app/", true, /\.spec\.ts$/);
const custom = require.context("../custom/app/", true, /\.spec\.ts$/);
// And load the modules.
rapydo.keys().map(rapydo);
custom.keys().map(custom);
