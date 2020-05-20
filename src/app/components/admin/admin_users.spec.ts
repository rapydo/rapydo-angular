import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppModule } from '@rapydo/app.module';
import { AdminUsersComponent } from '@rapydo/components/admin/admin_users';
import { AdminModule } from '@rapydo/components/admin/admin.module';
import { User } from '@rapydo/services/auth'

import { environment } from '@rapydo/../environments/environment'

describe('AdminUsersComponent', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let component: AdminUsersComponent;

  const users: Array<User> = [
    {
      'uuid': 'x',
      'email': 'email@example.com',
      'name': 'A',
      'surname': 'B',
      'isAdmin': true,
      'isLocalAdmin': false,
      'isGroupAdmin': false,
      'privacy_accepted': true,
    }
  ]
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule, HttpClientTestingModule]
    })
    .compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const req = httpMock.expectOne(environment.apiUrl + '/admin/users');
    expect(req.request.method).toEqual('GET');
    req.flush(users);

    httpMock.verify();
  }));

  it('component initialization', () => {
    expect(component).toBeDefined();
  });

  it('get data', () => {
    // component.list().subscribe(
    //   result => {
    //     expect(result).not.toBeUndefined();
    //   },
    //   error => {
    //     expect(error).toBeUndefined();
    //   }
    // );

  });


});

