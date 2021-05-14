import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";

@Injectable()
export class SSRService {
  public readonly isBrowser: boolean = isPlatformBrowser(this.platformId);
  public readonly isServer: boolean = isPlatformServer(this.platformId);

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
}
