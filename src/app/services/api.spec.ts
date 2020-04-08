import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '@rapydo/services/api';

import { environment } from '@rapydo/../environments/environment'

describe('ApiService', () => {
  let injector: TestBed;
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService],
      imports: [
        HttpClientTestingModule
      ]
    });

    injector = getTestBed();
    service = injector.inject(ApiService);
    httpMock = injector.inject(HttpTestingController);
  });

	it('GET - success', () => {

	    let response;
	    if (environment.WRAP_RESPONSE == '1') {
	      response = {
	        "Meta": {

	        },
	        "Response": {
	          "data": {
	            "key": "value"
	          }
	        }
	      }
	    } else {
	      response = "value";
	    }

	    service.get("status").subscribe(
	      result => {
          	expect(result).not.toBeUndefined();
	      }
	    );

	    const login_req = httpMock.expectOne(environment.apiUrl + '/status');
	    expect(login_req.request.method).toEqual('GET');
	    login_req.flush(response);

	    httpMock.verify();
	});

	afterEach(() => {
	    // make sure that there are no outstanding requests
	    httpMock.verify();
	});

});