import {
  Component,
  ChangeDetectorRef,
  OnInit,
  Input,
  ElementRef,
  Renderer2,
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";

import { environment } from "@rapydo/../environments/environment";

import { ProjectOptions } from "@app/customization";
import { LocalStorageService } from "@rapydo/services/localstorage";
import { ApiService } from "@rapydo/services/api";
import { AuthService } from "@rapydo/services/auth";
import { SSRService } from "@rapydo/services/ssr";
import { ConfirmationModals } from "@rapydo/services/confirmation.modals";
import { User, ConfirmationModalOptions, AdminMenu } from "@rapydo/types";

@Component({
  selector: "navbar",
  templateUrl: "navbar.html",
})
export class NavbarComponent implements OnInit {
  public user: User;
  public loading: boolean = true;

  public showLogin: boolean = true;
  public allowRegistration: boolean = false;
  public multiLang: boolean = false;

  // This property tracks whether the menu is open.
  // Start with the menu collapsed so that it does not
  // appear initially when the page loads on a small screen
  public isMenuCollapsed = true;

  public admin_entries: AdminMenu[];

  @Input()
  set display(value: string) {
    this._display = value;
    if (value === "none") {
      this.hide();
      return;
    }
    this.show();
  }
  private _display = "block";

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private customization: ProjectOptions,
    private local_storage: LocalStorageService,
    public api: ApiService,
    public ssr: SSRService,
    private auth: AuthService,
    private confirmationModals: ConfirmationModals,
    private ref: ChangeDetectorRef,
    private _el: ElementRef,
    private _renderer: Renderer2,
    private translate: TranslateService
  ) {
    this.showLogin = environment.showLogin;
    this.allowRegistration = environment.allowRegistration;
    this.multiLang = environment.multiLang;
  }

  ngOnInit() {
    this.loading = true;
    this.auth.isAuthenticated(false).subscribe((is_auth) => {
      if (is_auth) {
        this.user = this.auth.getUser();
        this.fill_admin_menu(this.user);
      } else {
        this.user = null;
      }
      this.loading = false;
    });

    this.local_storage.userChanged.subscribe((user) => this.changeLogged(user));
  }

  changeLogged(user: any) {
    if (user === this.local_storage.LOGGED_OUT) {
      this.user = null;
      this.ref.detectChanges();
    } else if (user === this.local_storage.LOGGED_IN) {
      this.user = this.auth.getUser();
      this.fill_admin_menu(this.user);
      // } else {
      //   console.warn("Received unknown user event: <" + user + ">");
    }
  }

  private fill_admin_menu(user: User): void {
    this.admin_entries = [];

    if (user) {
      this.admin_entries.push({
        enabled: user.isAdmin || user.isStaff,
        label: "Users",
        router_link: "/app/admin/users",
      });

      this.admin_entries.push({
        enabled: user.isAdmin || user.isStaff,
        label: "Groups",
        router_link: "/app/admin/groups",
      });

      this.admin_entries.push({
        enabled: user.isAdmin,
        label: "Logins",
        router_link: "/app/admin/logins",
      });

      this.admin_entries.push({
        enabled: user.isAdmin,
        label: "Sessions",
        router_link: "/app/admin/sessions",
      });

      this.admin_entries.push({
        enabled: user.isAdmin,
        label: "Server Stats",
        router_link: "/app/admin/stats",
      });

      this.admin_entries.push({
        enabled: user.isAdmin,
        label: "Send mail",
        router_link: "/app/admin/mail",
      });

      const custom_entries: AdminMenu[] =
        this.customization.admin_menu_entries(user);

      this.admin_entries.push(...custom_entries);
    }
  }

  do_logout(): void {
    const options: ConfirmationModalOptions = {
      text: "Do you really want to close the current session?",
      disableSubText: true,
      confirmButton: "Confirm",
      cancelButton: "Cancel",
    };

    this.confirmationModals.open(options).then(
      (result) => {
        this.auth.logout().subscribe((response) => {
          this.router.navigate([""]);
        });
      },
      (reason) => {},
    );
  }

  /** allows to manually show this content */
  show(): void {
    this._renderer.setStyle(this._el.nativeElement, "display", this._display);
  }

  /** allows to manually hide content */
  hide(): void {
    this._renderer.setStyle(this._el.nativeElement, "display", "none");
  }

  changeLang(language: string) {
    this.translate.use(language);
  }

}
