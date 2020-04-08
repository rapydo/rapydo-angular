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
			imports: [ HttpClientTestingModule ]
		});

		injector = getTestBed();
		service = injector.inject(ApiService);
		httpMock = injector.inject(HttpTestingController);
	});

	it('POST - success', () => {

	    service.post("xyz", {"key": value}).subscribe(
	      result => {
          	expect(result).not.toBeUndefined();
	      }
	    );

	    const login_req = httpMock.expectOne(environment.apiUrl + '/xyz');
	    expect(login_req.request.method).toEqual('POST');
	    login_req.flush('');

	    httpMock.verify();
	});

	afterEach(() => {
	    // make sure that there are no outstanding requests
	    httpMock.verify();
	});

});