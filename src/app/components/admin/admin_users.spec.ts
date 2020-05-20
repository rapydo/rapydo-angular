import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppModule } from '@rapydo/app.module';
import { AdminUsersComponent } from '@rapydo/components/admin/admin_users';
import { AdminModule } from '@rapydo/components/admin/admin.module';

import { environment } from '@rapydo/../environments/environment'

describe('AdminUsersComponent', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let component: AdminUsersComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule]
    })
    .compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('component initialization', () => {
    expect(component).toBeDefined();
  });

  it('get data', () => {
    component.list().subscribe(
      result => {
          expect(result).not.toBeUndefined();
      }
    );
    const req = httpMock.expectOne(environment.apiUrl + '/admin/users');
    expect(req.request.method).toEqual('GET');
    req.flush([
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
    );

    httpMock.verify();
  });


});

