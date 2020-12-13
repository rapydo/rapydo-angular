import { NgModule } from "@angular/core";
import { ServerModule } from "@angular/platform-server";
import { BrowserModule } from "@angular/platform-browser";

import { AppModule } from "@rapydo/app.module";
import { AppComponent } from "@rapydo/app.component";

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: "RAPyDo",
    }),
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
