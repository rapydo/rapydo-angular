import { TestBed, getTestBed } from "@angular/core/testing";
import { AppModule } from "@rapydo/app.module";
import { LocalStorageService } from "@rapydo/services/localstorage";
import { User } from "@rapydo/types";

describe("LocalStorageService", () => {
  let injector: TestBed;
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
      imports: [AppModule],
    });

    injector = getTestBed();
    service = injector.inject(LocalStorageService);
  });

  it("getUser", async () => {
    expect(service.getUser()).toBeNull();

    user1: User = {
      isAdmin: false,
      isStaff: false,
      isCoordinator: false,
      is_active: true,
      expiration: null,
      privacy_accepted: true,
      roles: {},
      first_login: null,
      last_login: null,
      last_password_change: null,
      group: null,
      two_factor_enabled: false,
    };

    user2: User = {
      isAdmin: false,
      isStaff: false,
      isCoordinator: false,
      is_active: true,
      expiration: null,
      privacy_accepted: true,
      roles: {},
      first_login: null,
      last_login: null,
      last_password_change: null,
      group: null,
      two_factor_enabled: false,
    };

    service.setUser(user1);
    expect(service.getUser()).toEqual(user1);
    expect(service.getUser()).not.toEqual(user2);

    service.setUser(user2);
    expect(service.getUser()).toEqual(user2);
    expect(service.getUser()).not.toEqual(user1);

    service.removeUser();
    expect(service.getUser()).toBeNull();

    service.setUser(user1);
    expect(service.getUser()).toEqual(user1);

    service.clean();
    expect(service.getUser()).toBeNull();
  });

  it("getToken", async () => {
    expect(service.getToken()).toBeNull();

    service.setToken("abcdefghijklmnopqrstuvwxyz");
    expect(service.getToken()).toEqual("abcdefghijklmnopqrstuvwxyz");

    service.setToken("12345678901234567890123456");
    expect(service.getToken()).toEqual("12345678901234567890123456");

    service.removeToken();
    expect(service.getToken()).toBeNull();

    service.setToken("abcdefghijklmnopqrstuvwxyz");
    expect(service.getToken()).toEqual("abcdefghijklmnopqrstuvwxyz");

    service.clean();
    expect(service.getToken()).toBeNull();
  });
});
