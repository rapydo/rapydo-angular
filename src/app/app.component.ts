import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { DeviceDetectorService } from "ngx-device-detector";
import { filter, map, mergeMap } from "rxjs/operators";

import { environment } from "@rapydo/../environments/environment";

import { AuthService } from "@rapydo/services/auth";
import { ApiService } from "@rapydo/services/api";
import { SSRService } from "@rapydo/services/ssr";
import { NavbarComponent } from "@rapydo/components/navbar/navbar";
import { NotificationService } from "@rapydo/services/notification";
import { ProjectOptions } from "@app/customization";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {
  @ViewChild("cookieLaw", { static: false }) private cookieLawEl: any;

  public cookieLawText: string;
  public cookieLawButton: string;
  public enableFooter: boolean = false;

  constructor(
    public api: ApiService,
    private auth: AuthService,
    private metaService: Meta,
    private titleService: Title,
    private customization: ProjectOptions,
    private notify: NotificationService,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute,
    private router: Router,
    public ssr: SSRService
  ) {
    this.enableFooter = environment.enableFooter;
    this.cookieLawText = this.customization.cookie_law_text();
    this.cookieLawButton = this.customization.cookie_law_button();

    if (this.ssr.isBrowser) {
      let deviceInfo = deviceService.getDeviceInfo();

      let browser = deviceInfo.browser;
      let version = deviceInfo.browser_version;
      let os = deviceInfo.os;
      let os_version = deviceInfo.os_version;
      let compatibilityCheck = this.checkCompatibility(
        browser,
        version,
        os,
        os_version
      );

      let device = "";

      /* istanbul ignore if */
      if (deviceService.isMobile()) {
        device = "mobile";
      }
      /* istanbul ignore if */
      if (deviceService.isTablet()) {
        device = "tablet";
      }
      /* istanbul ignore else */
      if (deviceService.isDesktop()) {
        device = "desktop";
      }

      console.info(
        browser +
          " (" +
          version +
          ") on " +
          os +
          " " +
          device +
          " (" +
          os_version +
          ")"
      );

      /* istanbul ignore if */
      if (!compatibilityCheck) {
        this.notify.showError(
          "You are using " +
            browser +
            " " +
            version +
            " on " +
            os +
            ". We apologize, but your browser is not fully compatible with this website and some or all functionalities may not work."
        );
      }
    }
  }
  private checkCompatibility(
    browser: string,
    version: string,
    os: string,
    os_version: string
  ): boolean {
    /* istanbul ignore if */
    if (browser === "IE") {
      if (parseFloat(version) <= 10) {
        return false;
      }
    }
    return true;
  }

  public ngOnInit(): void {
    // Set default title / description and keywords
    let title = environment.projectTitle;
    title = title.replace(/^'/, "");
    title = title.replace(/'$/, "");
    let description = environment.projectDescription;
    description = description.replace(/^'/, "");
    description = description.replace(/'$/, "");

    const defaultFullTitle = `${title}: ${description}`;
    const defaultKeywords = environment.projectKeywords;

    this.titleService.setTitle(defaultFullTitle);
    this.metaService.addTags([
      { name: "keywords", content: defaultKeywords },
      { name: "description", content: defaultFullTitle },
      { name: "robots", content: "index, follow" },
    ]);

    // Set route specific title / description and keywords, if defined
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === "primary"),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        if (event["description"]) {
          const t = event["title"] || title;
          const fullTitle = `${t}: ${event["description"]}`;
          this.titleService.setTitle(fullTitle);
          this.metaService.addTags([
            { name: "description", content: fullTitle },
          ]);
        } else {
          this.titleService.setTitle(defaultFullTitle);
          this.metaService.addTags([
            { name: "description", content: defaultFullTitle },
          ]);
        }
        if (event["keywords"]) {
          this.metaService.addTags([
            { name: "keywords", content: event["keywords"] },
          ]);
        } else {
          this.metaService.addTags([
            { name: "keywords", content: defaultKeywords },
          ]);
        }
      });
  }

  public dismissCookieLaw(): void {
    this.cookieLawEl.dismiss();
  }

  public refresh(): void {
    window.location.reload();
  }
}
