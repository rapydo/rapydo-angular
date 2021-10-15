import { NgModule } from "@angular/core";
import { ServerModule } from "@angular/platform-server";
import { BrowserModule } from "@angular/platform-browser";

import { AppModule } from "@rapydo/app.module";
import { AppComponent } from "@rapydo/app.component";
import { environment } from "@rapydo/../environments/environment";

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: environment.projectName,
    }),
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
