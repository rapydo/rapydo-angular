import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from '@rapydo/app.module';
import { SharedModule } from '@rapydo/shared.module';

// this test makes sense? It only load SharedModule, what can we verify??

describe('SharedModule', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, SharedModule]
    })
    .compileComponents();

  }));

});

