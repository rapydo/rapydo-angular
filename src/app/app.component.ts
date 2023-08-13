import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";
import { filter, map, mergeMap } from "rxjs/operators";

import { environment } from "@rapydo/../environments/environment";

import { AuthService } from "@rapydo/services/auth";
import { ApiService } from "@rapydo/services/api";
import { SSRService } from "@rapydo/services/ssr";
import { SharedService } from "@rapydo/services/shared-service";
import { NavbarComponent } from "@rapydo/components/navbar/navbar";
import { NotificationService } from "@rapydo/services/notification";
import { ProjectOptions } from "@app/customization";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("cookieLaw", { static: false }) private cookieLawEl: any;
  @ViewChild("navbar", { static: false }) private navbar: NavbarComponent;

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
    private route: ActivatedRoute,
    private router: Router,
    public ssr: SSRService,
    private sharedService: SharedService,
  ) {
    this.enableFooter = environment.enableFooter;
    this.cookieLawText = this.customization.cookie_law_text();
    this.cookieLawButton = this.customization.cookie_law_button();
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
        mergeMap((route) => route.data),
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

  ngAfterViewInit(): void {
    this.sharedService.iframeModeEmitted$.subscribe((isFlagOn: boolean) => {
      setTimeout(() => {
        // show/hide footer
        this.enableFooter = !isFlagOn;
      });
      // show/hide navbar
      isFlagOn ? this.navbar.hide() : this.navbar.show();
    });
  }

  public dismissCookieLaw(): void {
    this.cookieLawEl.dismiss();
  }

  public refresh(): void {
    window.location.reload();
  }
}
