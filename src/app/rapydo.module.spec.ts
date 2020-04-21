import { TestBed, getTestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

import { AppModule } from '@rapydo/app.module';
import { RapydoModule } from '@rapydo/rapydo.module';
import { AppComponent } from '@rapydo/app.component';

describe('Core routing', () => {
  let injector: TestBed;
  let router: Router;
  let location: Location;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });

    injector = getTestBed();
    router = injector.inject(Router);
    location = TestBed.get(Location); (3)

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

  it('navigate to /app/login', fakeAsync(() => {
    router.navigate(['/app/login']);
    tick();
    expect(location.path()).toBe('/app/login');
  }));

  it('navigate to /app/profile', fakeAsync(() => {
    router.navigate(['/app/profile']);
    tick();
    expect(location.path()).toBe('/app/login');
  }));

  it('navigate to /app/admin/users', fakeAsync(() => {
    router.navigate(['/app/admin/users']);
    tick();
    expect(location.path()).toBe('/app/login');
  }));

});