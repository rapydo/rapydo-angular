import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppModule } from '@rapydo/app.module';
import { AdminUsersComponent } from '@rapydo/components/admin/admin_users';
import { AdminModule } from '@rapydo/components/admin/admin.module';

describe('AdminUsersComponent', () => {
  let injector: TestBed;
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    httpMock = injector.inject(HttpTestingController);
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

