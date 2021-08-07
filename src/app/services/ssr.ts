import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";

import { environment } from "@rapydo/../environments/environment";

@Injectable()
export class SSRService {
  // use environment variable FORCE_SSR_SERVER_MODE
  // to force the frontend to render as in server mode
  public readonly isBrowser: boolean =
    isPlatformBrowser(this.platformId) && !environment.forceSSRServerMode;
  public readonly isServer: boolean =
    isPlatformServer(this.platformId) || environment.forceSSRServerMode;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (environment.forceSSRServerMode) {
      console.warn("Force SSR Server Mode is enabled!");
      console.log(`isBrowser = ${this.isBrowser}`);
      console.log(`isServer = ${this.isServer}`);
    }
  }
}
