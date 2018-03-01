
import { Injectable, Pipe } from '@angular/core';

@Pipe({
	name: 'iterate'
})
@Injectable()
export class IteratePipe {


	transform(value, skipFields:string[]):any {
		let keys = [];

		if (!skipFields) {
			skipFields = [];
		}
		for (let key in value) {

			if (skipFields.indexOf(key) > -1) {
				continue;
			}

			keys.push({key: key, value: value[key]});
		}
		return keys;
	}
}