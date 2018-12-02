import { Injectable, Pipe } from '@angular/core';

@Pipe({
    name: 'iterate'
})
@Injectable()
export class IteratePipe {


    transform(value, skipFields: string[]): any {
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


@Pipe({
    name: 'bytes'
})
@Injectable()
export class BytesPipe {

    transform(bytes, precision): string {
        if (bytes === 0)
          return '0'

        if (bytes === -1 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';

        let units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));

        if (typeof precision === 'undefined') {
            if (number <= 1) precision = 0;
            else precision = 1;
        }
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
      }

}
