import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModule } from '@rapydo/app.module';
import { IteratePipe, BytesPipe, BooleanFlagPipe, YesNoPipe } from '@rapydo/pipes/pipes';
import { LoginModule } from '@rapydo/components/login/login.module';

describe('Pipes', () => {
  let iterate_pipe: IteratePipe;
  let bytes_pipe: BytesPipe;
  let boolean_pipe: BooleanFlagPipe;
  let yesno_pipe: YesNoPipe;

  beforeEach(() => {
    iterate_pipe = new IteratePipe();
    bytes_pipe = new BytesPipe();
    boolean_pipe = new BooleanFlagPipe();
    yesno_pipe = new YesNoPipe();
  });

  it('providing no value returns fallback', () => {
    expect(bytes_pipe.transform(0).toBe("0");
  });


});

