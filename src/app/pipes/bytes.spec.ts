import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppModule } from "@rapydo/app.module";
import { BytesPipe } from "@rapydo/pipes/bytes";
import { LoginModule } from "@rapydo/components/login/login.module";

describe("Pipes", () => {
  let bytes_pipe: BytesPipe;

  beforeEach(() => {
    bytes_pipe = new BytesPipe();
  });

  it("BytesPipe", () => {
    expect(bytes_pipe.transform(0)).toBe("0");
    expect(bytes_pipe.transform(-1)).toBe("-");
    expect(bytes_pipe.transform(10)).toBe("10 bytes");
    expect(bytes_pipe.transform(10240)).toBe("10 kB");
    expect(bytes_pipe.transform(10485760)).toBe("10.0 MB");
    expect(bytes_pipe.transform(10737418240)).toBe("10 GB");
    expect(bytes_pipe.transform(10995116277760)).toBe("10 TB");
    expect(bytes_pipe.transform(10, 0)).toBe("10 bytes");
    expect(bytes_pipe.transform(10, 1)).toBe("10.0 bytes");
    expect(bytes_pipe.transform(10, 2)).toBe("10.00 bytes");
    expect(bytes_pipe.transform(10, 3)).toBe("10.000 bytes");
  });
});
