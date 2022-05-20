// https://github.com/angular/angular/blob/main/aio/src/test.ts
// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/testing";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

declare const require: any;

// Needed for `assert` polyfill uses `process`.
// See: https://github.com/browserify/commonjs-assert/blob/bba838e9ba9e28edf3127ce6974624208502f6bc/internal/assert/assertion_error.js#L138
// The `assert` polyfill is needed because of `timezone-mock` which is a Node.JS library but in being used in Browser.
(globalThis as any).process = {
  env: {},
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  // Angular 13 defaulted this to true causing karma to fail
  // see: https://github.com/angular/angular/issues/44186#issuecomment-996162765
  {
    teardown: { destroyAfterEach: false },
  }
);

// Then we find all tests
const context = require.context("../", true, /\.spec\.ts$/);
// const rapydo = require.context("../rapydo/app/", true, /\.spec\.ts$/);
// const custom = require.context("../custom/app/", true, /\.spec\.ts$/);

// And load the modules.
context.keys().map(context);
// rapydo.keys().map(rapydo);
// custom.keys().map(custom);
