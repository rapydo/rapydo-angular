import { Component, VERSION as NG_VERSION } from '@angular/core';
import {version as NGJS_VERSION} from 'angular';

import '../assets/css/styles.css';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 

	versions = {
		angularjs: NGJS_VERSION.full,
		angular: NG_VERSION.full
	}
}
