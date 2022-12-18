/**
 * Angular 9 introduced a global $localize() function that needs to be loaded.
 * Please add import '@angular/localize'; to your polyfills.ts file.
 */
import "@angular/localize/init";

/**
 * To reference and create an instance of the Buffer.
 * This requires to install the buffer package.
 */
(window as any).global = window;
declare var global: any;
declare var require: any;
global.Buffer = global.Buffer || require("buffer").Buffer;
