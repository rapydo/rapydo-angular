import { Component, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { FieldType } from '@ngx-formly/core';

import { ApiService } from '/rapydo/src/app/services/api';

@Component({
  selector: 'formly-autocomplete',
  providers: [ApiService],
  template: `
  {{to | json}}
	<input [type]="text" 
		[formControl]="formControl"
		[formlyAttributes]="field"

		[(ngModel)]="model['group']"
		[ngbTypeahead]="search"


		class="form-control">
  `
})


		/*autocomplete="off" 
		ng-model="model[options.key]" 
		ng-model-options="{ getterSetter: true }"
		uib-typeahead="item as item[to.select_label] for item in ctrl.querySearch(options.key, $viewValue)"
		typeahead-select-on-blur=true
		typeahead-show-hint=true*/
export class AutocompleteComponent extends FieldType implements OnInit {

	constructor(private api: ApiService) {
		super();
	}

	public ngOnInit(): void { }

	search(text): Observable<string[]> {

		console.log(text);
		return of(['a', 'b', 'c']);
/*		return this.api.get('group', text).pipe(
			map(response => {
				return ['a', 'b', 'c'] }
			),
			catchError(error => {

				console.log(error);
        		return of([]);
        	})
		);*/
	}

}
