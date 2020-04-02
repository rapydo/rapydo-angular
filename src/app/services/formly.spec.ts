import { TestBed, getTestBed } from '@angular/core/testing';
import { FormlyService } from '@rapydo/services/formly';

describe('FormlyService', () => {
  let injector: TestBed;
  let service: FormlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FormlyService],
    });

    injector = getTestBed();
    service = injector.get(FormlyService);
  });

  it('json2Form - empty input', () => {
    service.json2Form().subscribe((res) => {
      expect(res).toEqual({"fields":[], "model": {}});
    })
  });


});