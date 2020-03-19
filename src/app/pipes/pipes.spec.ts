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
    expect(bytes_pipe.transform(0)).toBe("0");
    expect(bytes_pipe.transform(-1)).toBe("-");
    expect(bytes_pipe.transform("XYZ")).toBe("-");
    expect(bytes_pipe.transform(10).toBe("10 bytes");
    expect(bytes_pipe.transform(10240).toBe("10 kB");
    expect(bytes_pipe.transform(10485760).toBe("10 MB");
    expect(bytes_pipe.transform(10737418240‬).toBe("10 GB");
    expect(bytes_pipe.transform(‭10995116277760‬).toBe("10 TB");
    // expect(bytes_pipe.transform(1,125899906842624e+16‬).toBe("10 PB");

    // expect(bytes_pipe.transform({'a': 1, 'b': 2})).toBe([{'key': 'a', value: 1}, {'key': 'b', value: 2}]);

    expect(boolean_pipe.transform(true)).toBe("<i class='fas fa-check fa-large fa-green'></i>");
    expect(boolean_pipe.transform(false)).toBe("<i class='fas fa-times fa-large fa-red'></i");
    expect(boolean_pipe.transform("XYZ")).toBe("XYZ");

    expect(boolean_pipe.transform(true)).toBe("YES");
    expect(boolean_pipe.transform(false)).toBe("NO");
    expect(boolean_pipe.transform("XYZ")).toBe("XYZ");
  });


});

