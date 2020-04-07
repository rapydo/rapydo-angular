import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '@rapydo/services/api';

import { environment } from '@rapydo/../environments/environment';


export class ApiServiceStub extends ApiService {
    constructor() {
        super({} as HttpClient);
    }
 
    protected call(
      method:string, endpoint: string, id="", data={},
      formData=false, conf={}, base='api', rawResponse=false) {

        let response = "not-implemented"
        if (environment.WRAP_RESPONSE == '1') {
            return Observable.of({
                "data": response,
                "errors": []
            });
        return Observable.of(response);
    }

}
