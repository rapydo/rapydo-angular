import { TestBed, getTestBed } from '@angular/core/testing';
import { FormlyService } from '@rapydo/services/formly';

describe('FormlyService', () => {
  let injector: TestBed;
  let service: FormlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormlyService],
    });

    injector = getTestBed();
    service = injector.get(FormlyService);
  });

  it('json2Form - empty input', () => {
    expect(service.json2Form(undefined, undefined)).toEqual({"fields":[], "model": {}});
  });


});