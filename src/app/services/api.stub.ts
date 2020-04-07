import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '@rapydo/services/api';


export class ApiServiceStub extends ApiService {
    constructor() {
        super({} as HttpClient);
    }
 
    protected call(
      method:string, endpoint: string, id="", data={},
      formData=false, conf={}, base='api', rawResponse=false) {

        return Observable.of("not-implemented");
    }

}
