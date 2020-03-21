import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from '@rapydo/app.module';
import { NavbarComponent } from '@rapydo/components/navbar/navbar';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('component initialization', () => {
    expect(component).toBeDefined();
  });

});

