import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from '@rapydo/app.module';
import { AdminSessionsComponent } from '@rapydo/components/admin/admin_sessions';
import { AdminModule } from '@rapydo/components/admin/admin.module';

describe('AdminSessionsComponent', () => {
  let component: AdminSessionsComponent;
  let fixture: ComponentFixture<AdminSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, AdminModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('component initialization', () => {
    expect(component).toBeDefined();
  });

});

