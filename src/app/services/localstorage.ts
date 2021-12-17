import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { User } from "@rapydo/types";

@Injectable()
export class LocalStorageService {
  userChanged = new Subject<string>();

  readonly LOGGED_IN = "logged-in";
  readonly LOGGED_OUT = "logged-out";

  constructor() {}

  public getUser(): User {
    return JSON.parse(localStorage.getItem("currentUser"));
  }

  public getToken(): string {
    return JSON.parse(localStorage.getItem("token"));
  }
  public setUser(user: User) {
    localStorage.setItem("currentUser", JSON.stringify(user));

    this.userChanged.next(this.LOGGED_IN);
  }

  public setToken(token: string) {
    localStorage.setItem("token", token);
  }

  public removeToken() {
    this.clean();
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    this.userChanged.next(this.LOGGED_OUT);
  }

  public clean() {
    // Cleaning up the localStorage from data from the previous session
    Object.keys(localStorage).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
