import { TestBed, getTestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Location } from "@angular/common";
import { Router } from "@angular/router";

import { AppModule } from '@rapydo/app.module';
import { RapydoModule } from '@rapydo/rapydo.module';
import { AppComponent } from '@rapydo/app.component';

import { environment } from '@rapydo/../environments/environment';

describe('Core routing', () => {
  let injector: TestBed;
  let router: Router;
  let location: Location;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<AppComponent>;

  const mock401Response = {
    status: 401,
    statusText: 'UNAUTHORIZED'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
    });

    injector = getTestBed();
    router = injector.inject(Router);
    httpMock = injector.inject(HttpTestingController);
    location = TestBed.inject(Location);

  	// Creating the root component with the router-outlet so
  	// the router has somewhere to insert components.
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  });

	it('navigate to /public/reset', fakeAsync(() => {
	  router.navigate(['/public/reset']);
	  tick();
	  expect(location.path()).toBe('/public/reset');
	}));

  it('navigate to in offline mode', fakeAsync(() => {
    router.navigate(['/app/login']);
    tick();
    expect(location.path()).toBe('/offline');

    router.navigate(['/app/profile']);
    tick();
    expect(location.path()).toBe('/offline');

    router.navigate(['/app/admin/users']);
    tick();
    expect(location.path()).toBe('/offline');

  }));

  it('navigate to /app/login', fakeAsync(() => {
    router.navigate(['/app/login']);
    tick();
    expect(location.path()).toBe('/app/login');

    const profile_req = httpMock.expectOne(environment.authApiUrl + '/profile');
    expect(profile_req.request.method).toEqual('GET');
    profile_req.flush('', mock401Response);

    httpMock.verify();
  }));

  it('navigate to /app/profile', fakeAsync(() => {
    router.navigate(['/app/profile']);
    tick();
    expect(location.path()).toBe('/app/login');

    const profile_req = httpMock.expectOne(environment.authApiUrl + '/profile');
    expect(profile_req.request.method).toEqual('GET');
    profile_req.flush('', mock401Response);

    httpMock.verify();
  }));

  it('navigate to /app/admin/users', fakeAsync(() => {
    router.navigate(['/app/admin/users']);
    tick();
    expect(location.path()).toBe('/app/login');

    const profile_req = httpMock.expectOne(environment.authApiUrl + '/profile');
    expect(profile_req.request.method).toEqual('GET');
    profile_req.flush('', mock401Response);

    httpMock.verify();
  }));

});