import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { UpgradeModule }  from '@angular/upgrade/static';

import { AppModule } from './app/app.module';

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
	.then(platformRef => {

	const upgrade = platformRef.injector.get(UpgradeModule) as UpgradeModule;
	upgrade.bootstrap(document.body, ['web'], {strictDi: false});
});
