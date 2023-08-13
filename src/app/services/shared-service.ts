import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class SharedService {
  private emitIframeSource = new Subject<boolean>();
  iframeModeEmitted$ = this.emitIframeSource.asObservable();

  /**
   * Emit a change to enable embedded view in HTML iframe
   */
  emitChange(change: boolean) {
    this.emitIframeSource.next(change);
  }
}
