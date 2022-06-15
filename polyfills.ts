/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */
/***************************************************************************************************
 * BROWSER POLYFILLS
 */

// Old Safari and IE
import "core-js/stable";

/** Evergreen browsers require these. **/
// Used for reflect-metadata in JIT. If you use AOT (and only Angular decorators), you can remove.
import "core-js/proposals/reflect-metadata";

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
import "angular-polyfills/dist/classlist.js";

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 **/
// import 'web-animations-js';

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags.ts';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */

/***************************************************************************************************

/** Zone JS is required by default for Angular itself. */
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";

/** APPLICATION IMPORTS */

// import 'angular-polyfills/dist/all.js';
import "angular-polyfills/dist/typedarray.js";
import "angular-polyfills/dist/blob.js";
import "angular-polyfills/dist/formdata.js";
import "angular-polyfills/dist/intl.js";
import "angular-polyfills/dist/shim.js";
// This fails to import with error (on version 1.0.1):
// TypeError: Cannot set property 'true' of undefined
// import 'angular-polyfills/dist/webanimations.js';

/* istanbul ignore next */
// if (typeof (window as any).global === "undefined") {
//   (window as any).global = window;
// }

// Angular 9 introduced a global $localize() function that needs to be loaded.
// Please add import '@angular/localize'; to your polyfills.ts file.
import "@angular/localize/init";

// required by exceljs (no longer used)
// import "regenerator-runtime/runtime";

/* To reference and create an instance of the Buffer. This requires to install the buffer package. */
(window as any).global = window;
declare var global: (any);
declare var require: (any);
global.Buffer = global.Buffer || require('buffer').Buffer;
